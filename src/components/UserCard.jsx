function UserCard(props) {
  return (
    <div style={{
      border: "1px solid gray",
      padding: "10px",
      marginTop: "10px"
    }}>
      <h3>Name: {props.name}</h3>
      <p>Role: {props.role}</p>
    </div>
  )
}

export default UserCard