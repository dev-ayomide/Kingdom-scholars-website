// Everything inside the portal uses the large-print "ks" design system.
// The navigation frame is rendered by each page (see PortalFrame) so it always
// reflects who is signed in.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="ks">{children}</div>
}
