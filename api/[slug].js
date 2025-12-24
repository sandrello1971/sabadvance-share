export default async function handler(req, res) {
  const slug = req.query.slug;
  
  if (!slug) {
    return res.status(400).send('Slug mancante');
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,excerpt,featured_image`,
      {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      }
    );
    
    const posts = await response.json();
    const post = posts?.[0];

    if (!post) {
      return res.redirect(302, `https://sabadvance.it/blog`);
    }

    const title = post.title || 'SAB Advance';
    const description = post.excerpt || 'Articolo su SAB Advance';
    const image = post.featured_image || 'https://sabadvance.it/og-default.jpg';
    const articleUrl = `https://sabadvance.it/blog/${slug}`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    res.send(`<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
  <title>${title}</title>
</head>
<body>
  <p>Reindirizzamento a <a href="${articleUrl}">${title}</a>...</p>
  <script>window.location.replace("${articleUrl}");</script>
</body>
</html>`);
  } catch (error) {
    console.error('Errore:', error);
    res.redirect(302, `https://sabadvance.it/blog/${slug}`);
  }
}
