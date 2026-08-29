import User from "../models/User.js";
import { signInToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";



//////////SIGNUP

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = signInToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



////////// LOGIN

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (user.status === "block") {
  return res.status(403).json({
    success: false,
    message: "Your account has been blocked",
  });
}

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signInToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






/////////// PROTECTED CONTROLLER

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


////////// FORGOT PASSWORD

export const forgotPswd = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset password token
    const resetToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Verdant Noir Password",
      html: `
        <div style="
          width: 90%;
          max-width: 600px;
          margin: 40px auto;
          padding: 32px;
          font-family: Arial, sans-serif;
          color: #272821;
          background: #f7f6f0;
        ">

          <h1 style="
            color: #4f5540;
            margin-bottom: 20px;
          ">
            Reset Your Password
          </h1>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your Verdant Noir password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              margin: 20px 0;
              padding: 12px 22px;
              background: #4f5540;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
            "
          >
            Reset Password
          </a>

          <p style="
            color: #7a7c73;
            font-size: 14px;
          ">
            This password reset link will expire in 1 day.
          </p>

          <p style="
            color: #7a7c73;
            font-size: 14px;
          ">
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Email send failed",
    });
  }
};



// ================= RESET PASSWORD =================

export const resetPswd = async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: "Password and token are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Verify reset token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update password
    user.password = password;

    // User model's pre-save hook will hash it
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};