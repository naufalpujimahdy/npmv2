import LoginForm from './LoginForm';

export default function CmsLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.1),transparent_24%)] p-4 md:p-8">
      <LoginForm />
    </main>
  );
}
