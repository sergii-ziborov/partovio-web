export const metadata = { title: "Contact" };

export default function ContactPage() {
  const email = process.env.PARTOVIO_CONTACT_EMAIL;
  return (
    <main className="wrap article">
      <h1>Contact</h1>
      {email ? <p>Email <a href={`mailto:${email}`}>{email}</a>.</p> : <p>A public contact address has not been set yet.</p>}
    </main>
  );
}
