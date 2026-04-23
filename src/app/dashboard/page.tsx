import { createShortLink, getUserLinks } from '@/actions/link-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QrDialog } from '@/components/qr-dialog';

export default async function DashboardPage() {
  const links = await getUserLinks();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Links</h1>
          <p className="text-slate-500 mt-1">Manage your shortened URLs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Link Card */}
        <div className="md:col-span-1">
          <Card className="rounded-none sm:rounded-lg shadow-none border-slate-200 sticky top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-600">Create New Link</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={async (formData) => { "use server"; await createShortLink(formData); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originalUrl">Destination URL</Label>
                  <Input
                    id="originalUrl"
                    name="originalUrl"
                    placeholder="https://example.com/long-url"
                    required
                    className="border-slate-300 focus:ring-blue-600 shadow-none rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortCode">Custom Slug (Optional)</Label>
                  <div className="flex bg-slate-100 rounded-md border border-slate-300 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
                    <span className="px-3 py-2 text-slate-500 text-sm border-r border-slate-200 flex items-center">
                       /
                    </span>
                    <input
                      id="shortCode"
                      name="shortCode"
                      placeholder="custom-slug"
                      className="flex-1 px-3 py-2 bg-white text-sm outline-none rounded-r-md"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-none rounded-md">
                  Shorten URL
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        <div className="md:col-span-2 space-y-4">
          {links.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-300 rounded-lg text-center bg-white shadow-none">
              <p className="text-slate-500 mb-2 font-medium">You haven't created any links yet.</p>
              <p className="text-sm text-slate-400">Use the form to create your first short link!</p>
            </div>
          ) : (
            links.map((link) => (
              <Card key={link.id} className="rounded-none sm:rounded-lg shadow-sm border-slate-200 bg-white hover:border-blue-300 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-lg text-slate-900 flex items-center gap-2 font-mono">
                      <a href={`/${link.shortCode}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                        /{link.shortCode}
                      </a>
                    </div>
                    <div className="text-sm text-slate-500 truncate max-w-md" title={link.originalUrl}>
                      {link.originalUrl}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <QrDialog url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${link.shortCode}`} slug={link.shortCode} />
                    <div className="text-xs text-slate-400">
                      {new Date(link.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
