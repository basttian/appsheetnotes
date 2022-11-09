
import Layout from "../components/layout"


export default function AdminDashboard() {


  return (
    <Layout loader={false}>
      <h1>Tablero</h1>

    </Layout>
  )
}

AdminDashboard.auth = {
  role: "admin",
  unauthorized: "/", // redirect to this url
}
