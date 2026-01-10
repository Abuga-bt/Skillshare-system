import { ProfileCard } from "@/components/ProfileCard";

const Index = () => {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Customize your profile and showcase your work to the world
          </p>
        </header>

        {/* Profile Card */}
        <ProfileCard />
      </div>
    </main>
  );
};

export default Index;
