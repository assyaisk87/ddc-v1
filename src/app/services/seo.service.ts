import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeo(data: SeoData): void {
    const pageUrl = this.toAbsoluteUrl(data.url || this.document.location.pathname);
    const imageUrl = data.image ? this.toAbsoluteUrl(data.image) : this.toAbsoluteUrl('/icons/ddc_logo.svg');

    this.title.setTitle(data.title);

    this.meta.updateTag({ name: 'description', content: data.description }, 'name="description"');
    this.meta.updateTag({ name: 'robots', content: 'index, follow' }, 'name="robots"');

    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords }, 'name="keywords"');
    }

    this.meta.updateTag({ property: 'og:title', content: data.title }, 'property="og:title"');
    this.meta.updateTag({ property: 'og:description', content: data.description }, 'property="og:description"');
    this.meta.updateTag({ property: 'og:type', content: 'website' }, 'property="og:type"');
    this.meta.updateTag({ property: 'og:url', content: pageUrl }, 'property="og:url"');
    this.meta.updateTag({ property: 'og:image', content: imageUrl }, 'property="og:image"');
    this.meta.updateTag({ property: 'og:site_name', content: 'DDC' }, 'property="og:site_name"');

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' }, 'name="twitter:card"');
    this.meta.updateTag({ name: 'twitter:title', content: data.title }, 'name="twitter:title"');
    this.meta.updateTag({ name: 'twitter:description', content: data.description }, 'name="twitter:description"');
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl }, 'name="twitter:image"');

    this.updateCanonical(pageUrl);
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private toAbsoluteUrl(url: string): string {
    return new URL(url, this.document.location.origin).toString();
  }
}
