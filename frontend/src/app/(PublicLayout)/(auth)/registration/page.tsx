import RegistrationForm from "@/components/Auth/RegistrationForm";

export default function RegistrationPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full">
        <RegistrationForm />
      </div>
    </section>
  );
}
