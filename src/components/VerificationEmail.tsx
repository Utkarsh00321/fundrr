import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="SF Pro Display"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.cdnfonts.com/css/sf-pro-display",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your verification code: {otp}</Preview>
      <Container style={containerStyle}>
        <Section style={sectionStyle}>
          <Row>
            <Heading as="h1" style={headingStyle}>Verification Code</Heading>
          </Row>
          <Row>
            <Text style={textStyle}>Hello {username},</Text>
          </Row>
          <Row>
            <Text style={textStyle}>
              Thank you for registering. To complete your account setup, please use the following verification code:
            </Text>
          </Row>
          <Row>
            <Text style={otpStyle}>{otp}</Text>
          </Row>
          <Row>
            <Text style={textStyle}>
              This code will expire in 10 minutes. If you didn't request this code, please disregard this email.
            </Text>
          </Row>
          <Row>
            <Button href={`https://yourapp.com/verify/${username}`} style={buttonStyle}>
              Verify Account
            </Button>
          </Row>
          <Row>
            <Text style={footerStyle}>
              If you're having trouble with the button above, copy and paste the following link into your web browser:
              https://yourapp.com/verify/{username}
            </Text>
          </Row>
        </Section>
      </Container>
    </Html>
  );
}

const containerStyle = {
  backgroundColor: "#ffffff",
  fontFamily: "SF Pro Display, Arial, sans-serif",
};

const sectionStyle = {
  padding: "40px",
  maxWidth: "600px",
  margin: "0 auto",
};

const headingStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1d1d1f",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const textStyle = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#1d1d1f",
  marginBottom: "20px",
};

const otpStyle = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#0071e3",
  textAlign: "center" as const,
  letterSpacing: "5px",
  marginBottom: "30px",
};

const buttonStyle = {
  backgroundColor: "#0071e3",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  display: "inline-block",
};

const footerStyle = {
  fontSize: "12px",
  color: "#86868b",
  marginTop: "30px",
  textAlign: "center" as const,
};
