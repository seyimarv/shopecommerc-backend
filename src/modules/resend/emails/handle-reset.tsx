import {
    Text,
    Container,
    Heading,
  } from "@react-email/components"
  import { BaseEmailLayout } from "./components/BaseEmailLayout"
  
  type HandleResetEmailProps = {
    url: string
  }
  
  function HandleResetEmailComponent({ url }: HandleResetEmailProps) {
    return (
      <BaseEmailLayout previewText="Reset your password">
        <Container className="p-6">
          <Heading className="text-2xl font-bold text-center text-gray-800">
            Reset your password
          </Heading>
          <Text className="text-gray-800">
            You can reset your password by clicking the link below:
          </Text>
          <Text className="text-gray-800">
            <a href={url}>Reset Password</a>
          </Text>
        </Container>
      </BaseEmailLayout>
    )
  }
  
  export const handleResetEmail = (props: HandleResetEmailProps) => (
    <HandleResetEmailComponent {...props} />
  )
  
  // @ts-ignore
  export default () => <HandleResetEmailComponent {...mockOrder} />