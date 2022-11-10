
import Layout from "../components/layout"
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//CArd Info
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';

import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  return (
    <Layout loader={false}>
      <Paper sx={{ width: '100%', maxWidth: '100%' }}>
      <MenuList>
      <MenuItem onClick={() => router.back()}>
        <ListItemIcon>
          <ArrowBackIcon fontSize="small" />
        </ListItemIcon>
      </MenuItem>
      </MenuList>
      </Paper>
      <br />
      <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            alt={session.user.name ?? session.user.name}
            src={session.user.image ?? `${session.user.image}`}
            sx={{ width: 56, height: 56 }}
          />
        }
        title={session.user.name ?? session.user.name}
        subheader={session.user.email ?? session.user.email}
      />
      </Card>

    </Layout>
  )
}

AdminDashboard.auth = {
  role: "admin",
  unauthorized: "/", // redirect to this url
}
