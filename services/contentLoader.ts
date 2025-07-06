import bookContentIndex from '@/data/bookContent.json';

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  startPage: number;
  endPage: number;
  content?: string;
}

export interface BookData {
  title: string;
  subtitle: string;
  author: string;
  version: string;
  lastUpdated: string;
  chapters: Chapter[];
}

class ContentLoader {
  private contentCache: Map<string, string> = new Map();

  async loadChapterContent(chapterId: string): Promise<string> {
    // Check cache first
    if (this.contentCache.has(chapterId)) {
      return this.contentCache.get(chapterId)!;
    }

    try {
      const chapter = bookContentIndex.book.chapters.find(ch => ch.id === chapterId);
      if (!chapter) {
        throw new Error(`Chapter ${chapterId} not found`);
      }

      // Load content from assets
      const contentModule = await import(`@/assets/content/${chapter.contentFile}`);
      const content = contentModule.default || '';
      
      // Cache the content
      this.contentCache.set(chapterId, content);
      
      return content;
    } catch (error) {
      console.error(`Error loading chapter ${chapterId}:`, error);
      return 'תוכן לא זמין כרגע';
    }
  }

  getBookData(): BookData {
    return {
      title: bookContentIndex.book.title,
      subtitle: bookContentIndex.book.subtitle,
      author: bookContentIndex.book.author,
      version: bookContentIndex.book.version,
      lastUpdated: bookContentIndex.book.lastUpdated,
      chapters: bookContentIndex.book.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle,
        startPage: chapter.startPage,
        endPage: chapter.endPage,
      }))
    };
  }

  async getChapterWithContent(chapterId: string): Promise<Chapter | null> {
    const bookData = this.getBookData();
    const chapter = bookData.chapters.find(ch => ch.id === chapterId);
    
    if (!chapter) {
      return null;
    }

    const content = await this.loadChapterContent(chapterId);
    
    return {
      ...chapter,
      content
    };
  }
}

export const contentLoader = new ContentLoader();