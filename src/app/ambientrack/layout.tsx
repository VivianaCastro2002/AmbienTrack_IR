
import  DashboardHeader  from "@/components/header";

export default function AmbienTrackLayout({ children }: { children: React.ReactNode }) {
  return (     
      <div>
        <DashboardHeader></DashboardHeader>
        <div>
          {children}
          </div>
      </div>
  );
}
