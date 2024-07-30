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
} from '@react-email/components';



interface VerificationEmailProps {
    username?: string;
    otp: string;
    type: 'forget password' | 'verification'
    email?: string
}

export default function VerificationEmail({ username, otp, type }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>{type === 'verification' ? 'Verification Code' : 'Change Your Password'}</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            {type === 'verification' && <Preview>Here&apos;s your verification code: {otp}</Preview>}
            {type === 'forget password' && <Preview>click <span><a
                href='#'
            >Here</a></span> to change your old passowrd or copy and paste the link below in your browser. </Preview>}
            {type === 'verification' && <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following verification
                        code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>
                        If you did not request this code, please ignore this email.
                    </Text>
                </Row>

            </Section>}
            {type === 'forget password' && <Section>
                <Row>
                    <Text>
                        {/* {`${process.env.NEXT_PUBLIC_DOMAIN}/update/password`} */}
                        Your Verification Code : {otp}
                    </Text>
                </Row>
            </Section>}


        </Html>
    );
}