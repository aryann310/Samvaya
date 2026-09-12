import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Users, ExternalLink, ShieldCheck, UserCheck, Clock } from "lucide-react";

interface Collaborator {
  name: string;
  handle: string;
  github: string;
  role: string;
  status: string;
}

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    name: "Yash Patel",
    handle: "yashpatel-11",
    github: "https://github.com/yashpatel-11",
    role: "Project Lead / Full-Stack",
    status: "Repository Owner"
  },
  {
    name: "Aryann",
    handle: "aryann310",
    github: "https://github.com/aryann310",
    role: "Core Contributor / Full-Stack",
    status: "Collaborator"
  },
  {
    name: "Kajal",
    handle: "kajal3308",
    github: "https://github.com/kajal3308",
    role: "Team Member / Contributor",
    status: "Collaborator"
  },
  {
    name: "Sneh",
    handle: "sneh557",
    github: "https://github.com/sneh557",
    role: "Team Member / Contributor",
    status: "Collaborator"
  },
  {
    name: "Zeel Gadhavi",
    handle: "zeelgadhavi26-web",
    github: "https://github.com/zeelgadhavi26-web",
    role: "Team Member / Contributor",
    status: "Collaborator"
  },
  {
    name: "ZEEL K. THAKKAR",
    handle: "ZeelThakkar90",
    github: "https://github.com/ZeelThakkar90",
    role: "Team Member / Contributor",
    status: "Collaborator"
  }
];

export default function Team() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(DEFAULT_COLLABORATORS);

  useEffect(() => {
    fetch("http://localhost:5000/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCollaborators(data);
        }
      })
      .catch(() => {
        // Fallback to default collaborators list
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold mb-1">
            <Users className="w-5 h-5" />
            <span>Team Samvaya</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Project Collaborators</h1>
          <p className="text-muted-foreground mt-1">
            Official collaborators contributing to the AI-Driven Hyperlocal Business Advisory platform.
          </p>
        </div>
        <a
          href="https://github.com/yashpatel-11/Samvaya"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm self-start md:self-auto"
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Grid of Collaborators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map((member) => {
          const isOwner = member.status.includes("Owner");
          const isPending = member.status.includes("Pending");

          return (
            <Card key={member.handle} className="hover:shadow-md transition-shadow border-glass-border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://github.com/${member.handle}.png`}
                      alt={member.name}
                      className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover bg-muted/80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          member.name
                        )}&background=6366f1&color=fff`;
                      }}
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">{member.name}</CardTitle>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        @{member.handle}
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground font-medium">
                  {member.role}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  {isOwner ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Repository Owner
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Invite
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      Collaborator
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
