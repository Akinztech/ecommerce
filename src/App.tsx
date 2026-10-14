import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Heart, Menu, Minus, Pause, Play, Plus, Search, ShoppingBag, X } from 'lucide-react'
import './App.css'
import './storefront.css'

type Product = { id: number; name: string; category: string; price: number; image: string; detail: string; badge?: string }

const products: Product[] = [
  { id: 1, name: 'The Sunday Cushion', category: 'Cushions', price: 38500, image: 'photo-1584100936595-c0654b55a2e2', detail: 'Ochre / cotton velvet', badge: 'BESTSELLER' },
  { id: 2, name: 'Soft Form Throw', category: 'Throws', price: 62000, image: 'photo-1600210492486-724fe5c67fb0', detail: 'Olive / woven cotton', badge: 'JUST LANDED' },
  { id: 3, name: 'Morrow Stripe Cushion', category: 'Cushions', price: 42000, image: 'photo-1616486338812-3dadae4b4ace', detail: 'Terracotta / linen blend' },
  { id: 4, name: 'Everyday Linen Cover', category: 'Cushions', price: 29500, image: 'photo-1618221195710-dd6b41faaea6', detail: 'Ecru / washed linen' },
  { id: 5, name: 'Sunday Market Basket', category: 'Objects', price: 47000, image: 'photo-1595428774223-ef52624120d2', detail: 'Natural / handwoven raffia', badge: 'SMALL BATCH' },
  { id: 6, name: 'Cloudline Knit Throw', category: 'Throws', price: 78500, image: 'photo-1616486029423-aaa4789e8c9a', detail: 'Natural / recycled cotton' },
]

const heroSlides = [
  {
    eyebrow: 'A softer kind of everyday',
    title: 'Make room',
    emphasis: 'for slow living.',
    description: 'Considered textiles and little details, made to make your home feel more like you.',
    image: 'photo-1616486029423-aaa4789e8c9a',
    caption: '01 / THE SLOW HOME EDIT',
    note: 'Made for moments in between',
  },
  {
    eyebrow: 'Texture with a point of view',
    title: 'A softer',
    emphasis: 'side of home.',
    description: 'Natural textures, collected colors and pieces that settle in beautifully.',
    image: 'photo-1600210492486-724fe5c67fb0',
    caption: '02 / TEXTURE, TOGETHER',
    note: 'Layered for the everyday',
  },
  {
    eyebrow: 'Small details, lasting feeling',
    title: 'Come home',
    emphasis: 'to your kind.',
    description: 'Easy, thoughtful pieces for the rituals, pauses and people that make a home.',
    image: 'photo-1616486338812-3dadae4b4ace',
    caption: '03 / MADE TO FEEL LIKE YOU',
    note: 'A little more you, every day',
  },
]

const formatPrice = (price: number) => `₦${price.toLocaleString('en-NG')}`

function App() {
  const [category, setCategory] = useState('All pieces')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<number[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [savedOnly, setSavedOnly] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)

  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === 'All pieces' || product.category === category
    const matchesQuery = `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery && (!savedOnly || saved.includes(product.id))
  })
  const cartItems = products.filter((product) => cart[product.id])
  const cartCount = Object.values(cart).reduce((total, amount) => total + amount, 0)
  const cartTotal = cartItems.reduce((total, product) => total + product.price * cart[product.id], 0)
  const activeHeroSlide = heroSlides[heroSlideIndex]

  useEffect(() => {
    if (heroPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setHeroSlideIndex((index) => (index + 1) % heroSlides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [heroPaused])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.motion-reveal')
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function moveHeroSlide(direction: number) {
    setHeroSlideIndex((index) => (index + direction + heroSlides.length) % heroSlides.length)
  }

  function moveProducts(direction: number) {
    const slider = document.getElementById('product-slider')
    if (slider) slider.scrollBy({ left: direction * slider.clientWidth * 0.82, behavior: 'smooth' })
  }

  function changeCart(id: number, amount: number) {
    setCart((current) => {
      const quantity = (current[id] ?? 0) + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity }
    })
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div className="site-shell" id="top">
      <div className="announcement"><span>Thoughtful things for the spaces we call home</span><a href="#shop">Complimentary delivery over ₦150,000 <ArrowRight size={13} /></a></div>
      <header className="site-header">
        <button className="icon-button mobile-menu-trigger" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <a className="wordmark" href="#top"><span>forma</span><i>.</i><small>HOME, CONSIDERED</small></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <label className="mobile-nav-search"><Search size={16} /><input aria-label="Search products" placeholder="Search our store" value={query} onChange={(event) => { setQuery(event.target.value); setMenuOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }} /></label>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#services" onClick={() => setMenuOpen(false)}>Design services</a><a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
        </nav>
        <div className="header-actions">
          <label className="header-search"><Search size={17} /><input aria-label="Search products" placeholder="Search our store" value={query} onChange={(event) => { setQuery(event.target.value); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }} /></label>
          <button className={savedOnly ? 'icon-button is-active' : 'icon-button'} type="button" aria-label="Show saved pieces" onClick={() => { setSavedOnly(!savedOnly); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}><Heart size={19} />{saved.length > 0 && <span className="action-count">{saved.length}</span>}</button>
          <button className="bag-button" type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
        </div>
      </header>

      <main>
        <section className="hero-section" aria-roledescription="carousel" aria-label="Forma Home inspiration">
          <div className="hero-copy" key={`copy-${heroSlideIndex}`}><p className="eyebrow"><span className="eyebrow-line" /> {activeHeroSlide.eyebrow}</p><h1>{activeHeroSlide.title}<br /><em>{activeHeroSlide.emphasis}</em></h1><p className="hero-description">{activeHeroSlide.description}</p><div className="hero-actions"><a className="button button-dark" href="#shop">Shop the collection <ArrowRight size={16} /></a><a className="text-link" href="#story">Get to know us <ArrowRight size={14} /></a></div><div className="hero-proof"><span className="proof-stars">★★★★★</span><span>Made for everyday living</span></div><div className="hero-slider-controls"><button className="slider-arrow" type="button" aria-label="Previous inspiration" onClick={() => moveHeroSlide(-1)}><ArrowLeft size={16} /></button><div className="slider-dots" aria-label="Choose inspiration slide">{heroSlides.map((slide, index) => <button className={index === heroSlideIndex ? 'slider-dot active' : 'slider-dot'} type="button" key={slide.caption} aria-label={`Show slide ${index + 1}`} aria-pressed={index === heroSlideIndex} onClick={() => setHeroSlideIndex(index)} />)}</div><button className="slider-arrow" type="button" aria-label="Next inspiration" onClick={() => moveHeroSlide(1)}><ArrowRight size={16} /></button><button className="slider-arrow autoplay-toggle" type="button" aria-label={heroPaused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setHeroPaused(!heroPaused)}>{heroPaused ? <Play size={14} /> : <Pause size={14} />}</button></div></div>
          <div className="hero-visual" key={`image-${heroSlideIndex}`}><img src={`https://images.unsplash.com/${activeHeroSlide.image}?auto=format&fit=crop&w=1600&q=90`} alt="Sunlit living room styled with layered Forma Home textiles" /><div className="hero-image-caption"><span>{activeHeroSlide.caption}</span><span>{activeHeroSlide.note}</span></div><div className="hero-stamp"><span>MADE WITH<br />INTENTION</span><i>✳</i></div></div>
          <span className="hero-index">LAGOS · NIGERIA</span>
        </section>
        <section className="promise-strip motion-reveal"><div><span>01</span><p>Made in small batches</p></div><div><span>02</span><p>Natural, lasting materials</p></div><div><span>03</span><p>Thoughtfully shipped to you</p></div><small>A LITTLE LESS, A LOT MORE MEANING.</small></section>

        <section className="shop-section section-pad motion-reveal" id="shop">
          <div className="section-heading"><div><p className="eyebrow">THE GOOD THINGS</p><h2>Find your feel-good <em>piece.</em></h2></div><a className="text-link desktop-link" href="#journal">See what we're making <ArrowRight size={15} /></a></div>
          <div className="shop-toolbar"><div className="category-tabs" role="group" aria-label="Filter by category">{['All pieces', 'Cushions', 'Throws', 'Objects'].map((item) => <button className={category === item ? 'category-tab selected' : 'category-tab'} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>)}</div><span className="results-count">{visibleProducts.length} pieces</span><div className="product-slider-controls"><button className="slider-arrow" type="button" aria-label="Previous products" onClick={() => moveProducts(-1)}><ArrowLeft size={16} /></button><button className="slider-arrow" type="button" aria-label="Next products" onClick={() => moveProducts(1)}><ArrowRight size={16} /></button></div></div>
          {visibleProducts.length ? <div className="product-grid product-slider" id="product-slider" aria-label="Product carousel" aria-roledescription="carousel">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image-wrap"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=85`} alt={product.name} loading="lazy" />{product.badge && <span className="product-note">{product.badge}</span>}<button className={saved.includes(product.id) ? 'save-button saved' : 'save-button'} type="button" aria-label={`Toggle saved status for ${product.name}`} onClick={() => setSaved((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}><Heart size={18} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button><button className="quick-add" type="button" onClick={() => changeCart(product.id, 1)}><Plus size={15} /> Quick add</button></div><div className="product-details"><div><button className="product-name" type="button" onClick={() => setSelectedProduct(product)}>{product.name}</button><p>{product.detail}</p></div><strong>{formatPrice(product.price)}</strong></div></article>)}</div> : <div className="empty-results"><Search size={22} /><p>No pieces found. Try another search.</p><button type="button" onClick={() => { setQuery(''); setSavedOnly(false); setCategory('All pieces') }}>Clear filters</button></div>}
          <button className="button button-outline all-products" type="button" onClick={() => { setCategory('All pieces'); setSavedOnly(false); setQuery('') }}>Explore all pieces <ArrowRight size={15} /></button>
        </section>

        <section className="look-section motion-reveal" id="story"><div className="look-image"><img src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85" alt="Layered cushions and warm neutral textures" loading="lazy" /><span className="look-marker marker-one">01</span><span className="look-marker marker-two">02</span></div><div className="look-copy"><p className="eyebrow">A ROOM TO COME BACK TO</p><h2>Little layers.<br /><em>Big feeling.</em></h2><p>Texture changes everything. Start with a cushion you love, add a throw for slow mornings, and let the room become yours.</p><a className="button button-light" href="#shop">Shop the Sunday edit <ArrowRight size={16} /></a><span className="look-footnote">THE SUNDAY EDIT · NO. 04</span></div></section>

        <section className="services-section section-pad motion-reveal" id="services"><div className="services-copy"><p className="eyebrow">A LITTLE HELP FROM US</p><h2>Your home, with<br />a little more <em>you.</em></h2><p>Not sure where to start? Our design team helps you find the colors, textures and pieces that feel like home.</p><a className="button button-dark" href="mailto:hello@formahome.ng?subject=Design%20consultation">Book a consultation <ArrowRight size={16} /></a><span>VIRTUAL OR IN-PERSON · LAGOS</span></div><div className="services-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Warm, layered interior designed with natural textures" loading="lazy" /><div><span>THE FORMA APPROACH</span><span>Spaces with soul, never showroom.</span></div></div></section>

        <section className="journal-section section-pad motion-reveal" id="journal"><div className="section-heading"><div><p className="eyebrow">NOTES FROM HOME</p><h2>A little inspiration <em>for later.</em></h2></div><a className="text-link desktop-link" href="mailto:hello@formahome.ng?subject=Forma%20Journal">Read the journal <ArrowRight size={15} /></a></div><div className="journal-grid"><a className="journal-card" href="mailto:hello@formahome.ng?subject=Style%20notes"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85" alt="Styled living room with layered cushions" loading="lazy" /><span>STYLE NOTES · 5 MIN READ</span><h3>The art of a cushion that looks like you.</h3><b>Read story <ArrowRight size={14} /></b></a><a className="journal-card" href="mailto:hello@formahome.ng?subject=Choosing%20natural%20fabrics"><img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85" alt="Natural linen fabric and home details" loading="lazy" /><span>MATERIAL MATTERS · 4 MIN READ</span><h3>A little guide to living with linen.</h3><b>Read story <ArrowRight size={14} /></b></a><div className="journal-signup"><span className="signup-star">✳</span><p className="eyebrow">A NOTE FROM US</p><h3>Good things,<br /><em>occasionally.</em></h3><p>Styling notes, new arrivals and 10% off your first order.</p><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button type="submit" aria-label="Subscribe">{subscribed ? '✓' : <ArrowRight size={19} />}</button></form>{subscribed && <span className="subscribe-success">You're on the list. Welcome home.</span>}</div></div></section>

        <section className="instagram-strip"><div className="instagram-heading"><span>Come see us at <strong>@formahome</strong></span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">FOLLOW ALONG <ArrowRight size={13} /></a></div><div className="instagram-images">{products.map((product) => <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" key={product.id} aria-label="View Forma Home inspiration"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=500&q=75`} alt="Forma Home interiors" loading="lazy" /></a>)}</div></section>
      </main>

      <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark footer-wordmark" href="#top"><span>forma</span><i>.</i><small>HOME, CONSIDERED</small></a><p>Making home feel a little more like you, one thoughtful layer at a time.</p><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram · @formahome</a></div><div className="footer-column"><h3>Explore</h3><a href="#shop">Shop all</a><a href="#shop">Cushions & covers</a><a href="#shop">Throws</a><a href="#services">Design services</a></div><div className="footer-column"><h3>Here to help</h3><a href="mailto:hello@formahome.ng">Contact us</a><a href="mailto:hello@formahome.ng?subject=Order%20help">Order tracking</a><a href="mailto:hello@formahome.ng?subject=FAQs">FAQs & care</a><a href="mailto:hello@formahome.ng?subject=Shipping">Shipping & returns</a></div><div className="footer-contact"><span>GOOD HOMES START WITH A HELLO.</span><a href="mailto:hello@formahome.ng">hello@formahome.ng <ArrowRight size={16} /></a><p>Lagos, Nigeria · Monday to Friday</p></div></div><div className="footer-bottom"><span>© 2026 FORMA HOME. MADE WITH CARE IN NIGERIA.</span><div><a href="mailto:hello@formahome.ng?subject=Privacy">Privacy</a><a href="mailto:hello@formahome.ng?subject=Terms">Terms</a><span>NGN ₦</span></div></div></footer>
      <a className="whatsapp-link" href="https://wa.me/2348000000000?text=Hello%20Forma%20Home" target="_blank" rel="noreferrer"><span /> Chat with us</a>

      {selectedProduct && (
        <div className="drawer-backdrop product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="icon-button product-modal-close" type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}><X size={20} /></button>
            <div className="product-modal-image"><img src={`https://images.unsplash.com/${selectedProduct.image}?auto=format&fit=crop&w=1000&q=85`} alt={selectedProduct.name} /></div>
            <div className="product-modal-info">
              <p className="eyebrow">{selectedProduct.category.toUpperCase()} · FORMA HOME</p>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p className="product-modal-detail">{selectedProduct.detail}</p>
              <strong className="product-modal-price">{formatPrice(selectedProduct.price)}</strong>
              <p className="product-modal-description">A considered layer for slower mornings and everyday living. Designed to bring lasting texture and an easy, lived-in feel to your space.</p>
              <dl className="product-specs">
                <div><dt>Size</dt><dd>{selectedProduct.category === 'Throws' ? '130 × 170 cm' : '45 × 45 cm'}</dd></div>
                <div><dt>Material</dt><dd>{selectedProduct.detail.split('/')[1]?.trim() ?? 'Natural textile'}</dd></div>
                <div><dt>Care</dt><dd>Spot clean gently. Air dry away from direct sun.</dd></div>
                <div><dt>Availability</dt><dd>Small-batch stock; confirmation by our team</dd></div>
              </dl>
              <button className="button button-dark product-modal-add" type="button" onClick={() => { changeCart(selectedProduct.id, 1); setSelectedProduct(null); setCartOpen(true) }}>Add to bag <Plus size={16} /></button>
              <a className="product-help-link" href="mailto:hello@formahome.ng?subject=Product%20question">Questions about this piece? Ask us</a>
            </div>
          </section>
        </div>
      )}

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">YOUR GOOD THINGS</p><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div><button className="icon-button" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={20} /></button></div>{cartItems.length ? <><div className="cart-items">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=250&q=80`} alt="" /><div><h3>{product.name}</h3><p>{product.detail}</p><strong>{formatPrice(product.price)}</strong><div className="quantity-control"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeCart(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => changeCart(product.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><p>Shipping calculated at checkout.</p><a className="button button-dark" href="mailto:hello@formahome.ng?subject=Complete%20my%20order">Continue to checkout <ArrowRight size={16} /></a><small>Secure online payments coming soon</small></div></> : <div className="empty-cart"><ShoppingBag size={28} /><h3>Your bag is taking a quiet moment.</h3><p>Find something lovely to bring home.</p><button className="button button-dark" type="button" onClick={() => setCartOpen(false)}>Explore the collection <ArrowRight size={15} /></button></div>}</aside></div>}
    </div>
  )
}

export default App
