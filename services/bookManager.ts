import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookContent {
  chapters: ChapterContent[];
  metadata: BookMetadata;
}

export interface ChapterContent {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  startPage: number;
  endPage: number;
}

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  version: string;
  lastUpdated: string;
  totalChapters: number;
  totalPages: number;
}

class BookManager {
  private static instance: BookManager;
  private bookContent: BookContent | null = null;
  private readonly STORAGE_KEY = 'book_content';
  private readonly VERSION_KEY = 'book_version';

  static getInstance(): BookManager {
    if (!BookManager.instance) {
      BookManager.instance = new BookManager();
    }
    return BookManager.instance;
  }

  /**
   * Load book content from storage or default data
   */
  async loadBookContent(): Promise<BookContent> {
    if (this.bookContent) {
      return this.bookContent;
    }

    try {
      // Try to load from AsyncStorage first (for updated content)
      const storedContent = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedContent) {
        this.bookContent = JSON.parse(storedContent);
        return this.bookContent;
      }
    } catch (error) {
      console.warn('Failed to load stored book content:', error);
    }

    // Fallback to default content
    this.bookContent = await this.getDefaultBookContent();
    return this.bookContent;
  }

  /**
   * Get default book content (embedded in app)
   */
  private async getDefaultBookContent(): Promise<BookContent> {
    // Import your existing book data
    const { bookData } = await import('@/data/bookData');
    
    return {
      metadata: {
        title: bookData.title,
        subtitle: bookData.subtitle,
        author: 'המחבר',
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalChapters: bookData.chapters.length,
        totalPages: bookData.chapters[bookData.chapters.length - 1]?.endPage || 0
      },
      chapters: bookData.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        subtitle: chapter.subtitle,
        content: chapter.content,
        startPage: chapter.startPage,
        endPage: chapter.endPage
      }))
    };
  }

  /**
   * Update book content (for future content updates)
   */
  async updateBookContent(newContent: BookContent): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(newContent));
      await AsyncStorage.setItem(this.VERSION_KEY, newContent.metadata.version);
      this.bookContent = newContent;
    } catch (error) {
      console.error('Failed to update book content:', error);
      throw error;
    }
  }

  /**
   * Get a specific chapter by ID
   */
  async getChapter(chapterId: string): Promise<ChapterContent | null> {
    const content = await this.loadBookContent();
    return content.chapters.find(chapter => chapter.id === chapterId) || null;
  }

  /**
   * Get all chapters
   */
  async getAllChapters(): Promise<ChapterContent[]> {
    const content = await this.loadBookContent();
    return content.chapters;
  }

  /**
   * Get book metadata
   */
  async getMetadata(): Promise<BookMetadata> {
    const content = await this.loadBookContent();
    return content.metadata;
  }

  /**
   * Search within book content
   */
  async searchContent(query: string): Promise<SearchResult[]> {
    const content = await this.loadBookContent();
    const results: SearchResult[] = [];

    content.chapters.forEach(chapter => {
      const searchTerm = query.toLowerCase();
      const chapterContent = chapter.content.toLowerCase();
      let position = 0;

      while ((position = chapterContent.indexOf(searchTerm, position)) !== -1) {
        const start = Math.max(0, position - 50);
        const end = Math.min(chapter.content.length, position + searchTerm.length + 50);
        const context = chapter.content.substring(start, end);

        results.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          text: context,
          position: position,
        });

        position += searchTerm.length;
      }
    });

    return results;
  }

  /**
   * Check if content update is available
   */
  async checkForUpdates(): Promise<boolean> {
    try {
      // This would typically check a remote server for updates
      // For now, we'll just return false
      return false;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  /**
   * Import book content from external source
   */
  async importBookContent(contentData: any): Promise<void> {
    try {
      // Validate the content structure
      if (!this.validateBookContent(contentData)) {
        throw new Error('Invalid book content format');
      }

      await this.updateBookContent(contentData);
    } catch (error) {
      console.error('Failed to import book content:', error);
      throw error;
    }
  }

  /**
   * Export current book content
   */
  async exportBookContent(): Promise<string> {
    const content = await this.loadBookContent();
    return JSON.stringify(content, null, 2);
  }

  /**
   * Validate book content structure
   */
  private validateBookContent(content: any): boolean {
    return (
      content &&
      content.metadata &&
      content.chapters &&
      Array.isArray(content.chapters) &&
      content.chapters.every((chapter: any) => 
        chapter.id && 
        chapter.title && 
        chapter.content &&
        typeof chapter.startPage === 'number' &&
        typeof chapter.endPage === 'number'
      )
    );
  }
}

export interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  text: string;
  position: number;
}

export const bookManager = BookManager.getInstance();