import { Container, Section, Row, Column, Heading, Text, Link } from "@react-email/components"

type EmailBannerProps = {
  banner?: {
    body: string
    title: string
    url: string
  }
}

export const EmailBanner = ({ banner }: EmailBannerProps) => {
  if (!banner || !("title" in banner)) {
    return null
  }

  return (
    <Container
      className="mb-4 rounded-lg p-7"
      style={{
        background: 'linear-gradient(to right, #3b82f6, #4f46e5)'
      }}
    >
      <Section>
        <Row>
          <Column align="left">
            <Heading className="text-white text-xl font-semibold">
              {banner.title}
            </Heading>
            <Text className="text-white mt-2">{banner.body}</Text>
          </Column>
          <Column align="right">
            <Link href={banner.url} className="font-semibold px-2 text-white underline">
              Shop Now
            </Link>
          </Column>
        </Row>
      </Section>
    </Container>
  )
}
