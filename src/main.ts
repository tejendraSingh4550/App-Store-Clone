import { bootstrapApplication } from '@angular/platform-browser';
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type StoreApp = { name: string; category: string; subtitle: string; rating: string; age: string; icon: string; gradient: string; letter?: string; featured?: boolean; editor?: boolean; price?: string };

@Component({
  selector: 'app-root', standalone: true, imports: [CommonModule],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand" href="#top" aria-label="App Store home"><span class="brand-mark">A</span><span>App Store</span></a>
        <div class="side-label">DISCOVER</div>
        <nav class="side-nav" aria-label="Main navigation">
          <button *ngFor="let item of navigation" class="nav-item" [class.active]="activeTab() === item.name" (click)="selectTab(item.name)"><span class="nav-icon">{{item.icon}}</span>{{item.name}}</button>
        </nav>
        <div class="side-label categories-label">CATEGORIES</div>
        <nav class="side-nav category-nav" aria-label="Categories">
          <button *ngFor="let cat of categories" class="nav-item" [class.active]="activeCategory() === cat.name" (click)="selectCategory(cat.name)"><span class="category-dot" [style.background]="cat.color"></span>{{cat.name}}</button>
        </nav>
        <div class="sidebar-bottom"><div class="sidebar-note"><div class="note-icon">✦</div><strong>Made for you</strong><span>Discover apps that fit your life.</span><button (click)="selectTab('Today')">Explore picks <span>↗</span></button></div><div class="account"><div class="avatar">J</div><div><strong>Jamie Parker</strong><span>Personal account</span></div><span class="more">•••</span></div></div>
      </aside>

      <main id="top" class="main-content">
        <header class="topbar"><div class="breadcrumbs">Store <span>/</span> <strong>{{activeTab()}}</strong></div><div class="top-actions"><label class="search"><span>⌕</span><input type="search" placeholder="Search apps" aria-label="Search apps" [value]="query()" (input)="query.set($any($event.target).value)"><kbd>⌘ K</kbd></label><button class="profile-button" aria-label="Your account">JP</button></div></header>

        <section class="page-heading"><div><div class="eyebrow">MONDAY, MAY 19, 2025 <span>·</span> YOUR DAILY EDITION</div><h1>{{heading()}}<span class="heading-period">.</span></h1><p class="page-subtitle">{{subheading()}}</p></div><button class="updates-link" (click)="selectTab('Updates')"><span class="update-dot"></span> 3 updates <span>→</span></button></section>

        <section class="hero" aria-label="Featured app"><div class="hero-copy"><div class="hero-kicker"><span>✦</span> APP OF THE DAY</div><h2>Make room<br>for wonder.</h2><p>A softer way to plan your days, find your focus, and make space for what matters.</p><div class="hero-meta"><div class="app-icon hero-icon">✿</div><div class="hero-app-info"><strong>Daylight — daily planner</strong><span>Habits &amp; Wellness</span></div><button class="get-button hero-get" (click)="toggleInstalled('Daylight — daily planner')">{{isInstalled('Daylight — daily planner') ? 'OPEN' : 'GET'}}<small>{{isInstalled('Daylight — daily planner') ? '' : ' · FREE'}}</small></button></div><span class="hero-index">01 <span>/ 04</span></span></div><div class="hero-art"><div class="sun sun-one"></div><div class="sun sun-two"></div><div class="hero-arch"></div><div class="hero-orb orb-one"></div><div class="hero-orb orb-two"></div><div class="hero-window"><div class="window-top"><span>MONDAY, MAY 19</span><span>☼ &nbsp; 72°</span></div><div class="window-greeting">A little space<br>for yourself.</div><div class="window-task"><span class="task-check">✓</span><span>Take the scenic route</span><span>9:30</span></div><div class="window-task"><span class="task-check blank"></span><span>Make something good</span><span>12:00</span></div><div class="window-task"><span class="task-check blank"></span><span>Call someone you love</span><span>18:15</span></div><div class="window-bottom"><i></i><i></i><i></i><i></i><i></i></div></div><div class="art-label">A calmer kind of productivity</div></div></section>

        <section class="quick-row"><div class="quick-item"><span class="quick-symbol violet">✳</span><div><strong>Thoughtful picks</strong><span>Chosen by our editors</span></div><span class="quick-arrow">↗</span></div><div class="quick-item"><span class="quick-symbol coral">◉</span><div><strong>Made for iPhone</strong><span>Great on the go</span></div><span class="quick-arrow">↗</span></div><div class="quick-item"><span class="quick-symbol green">↗</span><div><strong>Trending now</strong><span>What everyone's using</span></div><span class="quick-arrow">↗</span></div></section>

        <section class="apps-section"><div class="section-heading"><div><div class="section-eyebrow">A FEW GOOD FINDS</div><h2>{{sectionTitle()}}</h2></div><button class="see-all" (click)="selectTab('Apps')">See all <span>→</span></button></div><div class="app-grid"><article class="app-card" *ngFor="let app of filteredApps()" (click)="selectedApp.set(app)"><div class="app-icon" [style.background]="app.gradient" [class.letter-icon]="app.letter">{{app.icon}}</div><div class="app-details"><div class="app-title-row"><h3>{{app.name}}</h3><span *ngIf="app.editor" class="editor-tag">EDITOR'S PICK</span></div><p>{{app.subtitle}}</p><div class="app-meta"><span class="rating">★ {{app.rating}}</span><span class="meta-separator">·</span><span>{{app.age}}</span><span class="app-category">{{app.category}}</span></div></div><button class="get-button" (click)="$event.stopPropagation(); toggleInstalled(app.name)">{{isInstalled(app.name) ? 'OPEN' : app.price || 'GET'}}</button></article><div class="empty-state" *ngIf="filteredApps().length === 0">No apps found. Try another search.</div></div></section>

        <footer><span>© 2025 App Store</span><div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Support</a></div><span class="footer-note">A little inspiration, every day. <span>✦</span></span></footer>
      </main>
    </div>

    <div class="modal-backdrop" *ngIf="selectedApp() as app" (click)="selectedApp.set(null)"><section class="detail-modal" role="dialog" aria-modal="true" [attr.aria-label]="app.name" (click)="$event.stopPropagation()"><button class="close-modal" (click)="selectedApp.set(null)" aria-label="Close">×</button><div class="detail-head"><div class="app-icon detail-icon" [style.background]="app.gradient">{{app.icon}}</div><div><div class="section-eyebrow">{{app.category}}</div><h2>{{app.name}}</h2><p>{{app.subtitle}}</p></div><button class="get-button" (click)="toggleInstalled(app.name)">{{isInstalled(app.name) ? 'OPEN' : 'GET'}}</button></div><div class="detail-stats"><div><strong>{{app.rating}}</strong><span>★★★★★</span><small>RATINGS</small></div><div><strong>4+</strong><span>Years old</span><small>AGE</small></div><div><strong>№ 4</strong><span>in {{app.category}}</span><small>CHART</small></div><div><strong>EN</strong><span>+ 6 languages</span><small>LANGUAGES</small></div></div><div class="detail-description"><div class="section-eyebrow">WHAT'S GOOD</div><p>Small moments, made a little better. {{app.name}} brings a thoughtful set of tools to your day with a calm, considered experience designed to feel right at home.</p></div><div class="screenshots"><div class="screenshot shot-a">A little more<br><em>you time.</em><span>Find your own rhythm.</span></div><div class="screenshot shot-b">Make space<br>for <em>good things.</em><span>Made for the in-between.</span></div></div></section></div>
  `
})
export class AppComponent {
  readonly navigation = [{name:'Today',icon:'✦'},{name:'Apps',icon:'▦'},{name:'Games',icon:'◈'}];
  readonly categories = [{name:'Productivity',color:'#9368ec'},{name:'Creativity',color:'#f07866'},{name:'Wellness',color:'#64b892'},{name:'Education',color:'#e5ae50'},{name:'Entertainment',color:'#5f9add'}];
  readonly apps: StoreApp[] = [
    {name:'Daylight',category:'Wellness',subtitle:'Find your everyday rhythm',rating:'4.9',age:'4+',icon:'✿',gradient:'linear-gradient(145deg,#f6c77e,#e98969)',editor:true},
    {name:'Notion',category:'Productivity',subtitle:'Write, plan, get organized',rating:'4.8',age:'4+',icon:'N',letter:'N',gradient:'#171717',editor:true},
    {name:'Headspace',category:'Wellness',subtitle:'Meditation made simple',rating:'4.9',age:'4+',icon:'☼',gradient:'linear-gradient(145deg,#f9ab67,#ef775d)'},
    {name:'Arc Search',category:'Productivity',subtitle:'A better way to browse',rating:'4.7',age:'12+',icon:'◒',gradient:'linear-gradient(145deg,#b9d9ff,#8384f7)'},
    {name:'Procreate Pocket',category:'Creativity',subtitle:'Art in your pocket',rating:'4.8',age:'4+',icon:'✺',gradient:'linear-gradient(145deg,#f7a579,#e65574)',price:'$5.99'},
    {name:'Duolingo',category:'Education',subtitle:'Learn a language for free',rating:'4.7',age:'4+',icon:'◉',gradient:'linear-gradient(145deg,#a0e76e,#46b842)'},
    {name:'Letterboxd',category:'Entertainment',subtitle:'Your life in film',rating:'4.8',age:'12+',icon:'▰',gradient:'linear-gradient(145deg,#63c8b3,#198c85)'},
    {name:'Things 3',category:'Productivity',subtitle:'Your to-do list, beautifully done',rating:'4.8',age:'4+',icon:'✓',gradient:'linear-gradient(145deg,#7eaff6,#466bd8)',price:'$9.99'}
  ];
  readonly activeTab = signal('Today'); readonly activeCategory = signal(''); readonly query = signal(''); readonly installed = signal<string[]>([]); readonly selectedApp = signal<StoreApp|null>(null);
  readonly filteredApps = computed(() => { const q=this.query().trim().toLowerCase(); const cat=this.activeCategory(); return this.apps.filter(a=>(!q||`${a.name} ${a.category} ${a.subtitle}`.toLowerCase().includes(q))&&(!cat||a.category===cat)); });
  readonly heading = computed(() => this.activeCategory() || ({Today:'Good things, today',Apps:'Apps to love',Games:'A little play'}[this.activeTab()] || 'Your updates'));
  readonly subheading = computed(() => this.activeCategory() ? `A few thoughtful finds in ${this.activeCategory().toLowerCase()}.` : 'Fresh ideas, thoughtful picks, and little things worth downloading.');
  readonly sectionTitle = computed(() => this.query() ? 'Search results' : this.activeCategory() ? `In ${this.activeCategory()}` : 'Worth a closer look');
  selectTab(tab:string){this.activeTab.set(tab);this.activeCategory.set('');}
  selectCategory(cat:string){this.activeCategory.set(this.activeCategory()===cat?'':cat);this.activeTab.set('Apps');}
  isInstalled(name:string){return this.installed().includes(name);}
  toggleInstalled(name:string){this.installed.update(items=>items.includes(name)?items: [...items,name]);}
}

bootstrapApplication(AppComponent).catch(error => console.error(error));
