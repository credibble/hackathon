import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const jobs = [
  {
    id: "uiux-designer",
    title: "UI/UX Designer",
    experience: "Minimum 2 years experience",
    type: "Full-time",
    location: "Remote",
    description:
      "Design intuitive, beautiful user experiences and iterate quickly with our product team. You'll craft flows, prototypes, and high-fidelity UI for web.",
  },
  {
    id: "3d-designer",
    title: "3D Designer",
    experience: "Minimum 2 years experience",
    type: "Full-time",
    location: "Remote",
    description:
      "Create compelling 3D visuals and motion assets that elevate our brand and product storytelling across marketing and product surfaces.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />
      <header className="border-b border-border bg-gradient-to-b from-muted/30 to-background pt-10">
        <div className="container mx-auto py-10 md:py-section">
          <h1 className="text-3xl md:text-4xl font-bold">
            Careers at Credibble
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
            Help build the future of real-world assets in DeFi. We're a
            remote-first team looking for talented individuals.
          </p>
        </div>
      </header>

      <section className="container mx-auto  py-8 md:py-section">
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <article key={job.id} className="contents">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{job.title}</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                      {job.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <span className="font-medium text-foreground">
                        Experience:
                      </span>{" "}
                      {job.experience}
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Location:
                      </span>{" "}
                      {job.location}
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button asChild className="w-full sm:w-auto">
                      <a
                        href={`mailto:careers@credible.app?subject=${encodeURIComponent(
                          job.title
                        )}%20Application`}
                      >
                        Apply Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
