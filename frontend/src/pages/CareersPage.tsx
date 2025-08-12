import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingHeader from "@/components/landing/LandingHeader";

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
  useEffect(() => {
    document.title = "Careers | Credibble";
    const desc =
      "Join Credibble — we're hiring UI/UX and 3D Designers (2+ years). Remote-friendly.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/careers`);

    // Structured data for job postings (JSON-LD)
    const scriptId = "ld-json-jobs";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    const ld = jobs.map((j) => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: j.title,
      description: j.description,
      employmentType: j.type,
      datePosted: new Date().toISOString().split("T")[0],
      hiringOrganization: {
        "@type": "Organization",
        name: "Credibble",
        url: window.location.origin,
      },
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "Worldwide",
      },
    }));
    script.textContent = JSON.stringify(ld);

    return () => {
      // keep tags; no cleanup to preserve SEO on navigation
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />

      <header className="border-b border-border bg-gradient-to-b from-muted/30 to-background pt-20">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold">
            Careers at Credibble
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
            Help build the future of real-world assets in DeFi. We’re a
            remote-first team looking for talented designers.
          </p>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8 md:py-12">
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
                    <Button asChild>
                      <a
                        href={`mailto:credibble.xyz@gmail.com?subject=${encodeURIComponent(
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
    </main>
  );
}
