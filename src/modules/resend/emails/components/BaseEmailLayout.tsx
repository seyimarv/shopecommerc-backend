import { Html, Head, Preview, Body, Section, Tailwind, Text } from "@react-email/components"
import React from "react"

type BaseEmailLayoutProps = {
  previewText: string
  children: React.ReactNode
}

export const BaseEmailLayout = ({ previewText, children }: BaseEmailLayoutProps) => {
  return (
    <Tailwind>
      <Html className="font-sans bg-gray-100">
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-white my-10 mx-auto w-full max-w-2xl">
          <Section className="bg-[#27272a] text-white px-6 py-4">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2447 3.92183L12.1688 1.57686C10.8352 0.807712 9.20112 0.807712 7.86753 1.57686L3.77285 3.92183C2.45804 4.69098 1.63159 6.11673 1.63159 7.63627V12.345C1.63159 13.8833 2.45804 15.2903 3.77285 16.0594L7.84875 18.4231C9.18234 19.1923 10.8165 19.1923 12.15 18.4231L16.2259 16.0594C17.5595 15.2903 18.3672 13.8833 18.3672 12.345V7.63627C18.4048 6.11673 17.5783 4.69098 16.2447 3.92183ZM10.0088 14.1834C7.69849 14.1834 5.82019 12.3075 5.82019 10C5.82019 7.69255 7.69849 5.81657 10.0088 5.81657C12.3191 5.81657 14.2162 7.69255 14.2162 10C14.2162 12.3075 12.3379 14.1834 10.0088 14.1834Z" fill="currentColor"></path></svg>
          </Section>
          {children}
          <Section className="bg-gray-50 p-6 mt-10">
            <Text className="text-center text-gray-500 text-sm">
              If you have any questions, reply to this email or contact our support team at support@shophaul.com.
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-4">
              © {new Date().getFullYear()} ShopHaul, Inc. All rights reserved.
            </Text>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  )
}
