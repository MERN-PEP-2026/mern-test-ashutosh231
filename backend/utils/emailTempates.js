export const otpTemplate = (otp)=> `
    <div style="font-family: Arial;">
        <h2>Verify your Account</h2>
        <p>Your OTP:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>Valid for 5 minutes.</p>
    </div>
`