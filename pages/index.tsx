import type { NextPage } from 'next'
import Layout from "../components/layout"
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import TableViewIcon from '@mui/icons-material/TableView';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"

const Home: NextPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  return (
    <>
    <Layout loader={false}>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      {session && (
      <Paper sx={{ width: '100%', maxWidth: '100%' }}>
      <MenuList>
      <MenuItem onClick={() => router.push('/notas')}>
        <ListItemIcon>
          <TableViewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
            Ir a notas
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => router.push('/admin')}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
            Administración
        </ListItemText>
      </MenuItem>
      </MenuList>
      </Paper>
    )}
    </Layout>
    </>
  )
}

export default Home
