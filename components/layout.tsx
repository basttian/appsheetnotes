import Header from "./header"
import Footer from "./footer"
import type { NextPage } from 'next'
import type { ReactChildren } from "react"
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';


interface Props {
  children: React.ReactNode,
  loader: boolean
}

function Layout({ children, loader }: Props) {
//const Layout: NextPage = ({ children, loader }: Props) => {
  return (
    <>
    {loader && (
        <LinearProgress />
      )}
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80vh',
        }}
      >
      <CssBaseline />
      <Container fixed >
      	{children}
      </Container>
      <Footer />
      </Box>
    </>
  )
}

export default Layout
