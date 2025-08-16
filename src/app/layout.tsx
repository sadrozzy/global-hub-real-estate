import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export const metadata = {
  title: 'My Global Hub International Real Estate',
  description: 'My Global Hub International Real Estate helps you find the best real estate in the world',
  icons: {
    icon: '/favicon.png',
  },
};