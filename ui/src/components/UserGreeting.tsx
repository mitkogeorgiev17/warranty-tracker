import "./UserGreeting.css";

interface UserGreetingProps {
  username: string;
}

function UserGreeting(props: UserGreetingProps) {
  return (
    <>
      <div className="container pt-5">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 text-bold">
          Welcome, {props.username}!
        </header>
      </div>
    </>
  );
}

export default UserGreeting;
