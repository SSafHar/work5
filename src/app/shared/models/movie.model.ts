import { SimpleItem } from '../components/tags/tags.component';

export class Movie {
  public id: string;
  public name: string;
}

export class ClientMovie extends Movie {
  public cover_image: {
    url: string;
    original: string;
  };
  public imdb: number;
}

export class AdminMovie extends Movie {
  public genres: string;
  public duration: string;
  public added: string;
  public released: number;
}

export class SingleMovie extends ClientMovie {
  public categories: any;
  public created: number;
  public description: string;
  public list_image: any;
  public rating: string;
  public runtime: number;
  public search_tags: any;
  public type: string;
  public video_url: string;
  public download_link: string;
  public updated: number;
  public year: number;
}
export class AdminMovieCreate {
  public id?: string;
  public imdb_id?: string;
  public name: string;
  public categories: SimpleItem[] = [];
  public type: string = 'movie';
  public description: string;
  public year: string;
  public search_tags: SimpleItem[] = [];
  public video_url: string;
  public runtime: number;
  public list_image: any;
  public cover_image: any;
  public season?: number;
  public episode?: number;
  public imdb?: string;
  public rating?: number;
  public actors?: SimpleItem[] = [];
  public director?: string;
}
