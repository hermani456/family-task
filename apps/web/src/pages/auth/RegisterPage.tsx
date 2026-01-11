import AuthLayout from "../../components/layouts/AuthLayout";

export const RegisterPage = () => {
  return (
    <AuthLayout mode="register">
      {/* Placeholder */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de Familia
          </label>
          <input
            type="text"
            className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
          />
        </div>
        <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
          Crear Cuenta
        </button>
      </div>
    </AuthLayout>
  );
};
