import { PhotoItem } from '../types';

export interface PhotoPack {
  id: string;
  name: string;
  vibe: string;
  cover: string;
  photos: PhotoItem[];
}

export const SAMPLE_PHOTO_PACKS: PhotoPack[] = [
  {
    id: 'european-summer',
    name: 'Italian Riviera & Summer',
    vibe: 'Golden hour, terracotta balconies, spritz & turquoise sea',
    cover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'es-1',
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        name: 'Amalfi Coast View',
        caption: 'Positano mornings'
      },
      {
        id: 'es-2',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        name: 'Turquoise Cove',
        caption: 'Salty hair, warm rocks'
      },
      {
        id: 'es-3',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        name: 'Piazza Cafe Gelato',
        caption: 'Stracciatella stop'
      },
      {
        id: 'es-4',
        url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
        name: 'Cinque Terre Village',
        caption: 'Pastel cliffside houses'
      },
      {
        id: 'es-5',
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        name: 'Sun loungers by the bay',
        caption: 'Yellow striped umbrellas'
      },
      {
        id: 'es-6',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        name: 'Sunset Spritz Toast',
        caption: 'Aperitivo hour always'
      },
      {
        id: 'es-7',
        url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
        name: 'Vintage Vespa on Cobblestone',
        caption: 'Roaming narrow streets'
      },
      {
        id: 'es-8',
        url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
        name: 'Golden Hour Waves',
        caption: 'Last dip of the day'
      }
    ]
  },
  {
    id: 'goa-trip',
    name: 'Chaotic Goa Beach Trip',
    vibe: 'Palm trees, scooter rides, coconut water & golden chaos',
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'goa-1',
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        name: 'Goa Palm Grove',
        caption: 'Anjuna sunrise'
      },
      {
        id: 'goa-2',
        url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        name: 'Friends on Scooters',
        caption: 'Getting lost in Chapora'
      },
      {
        id: 'goa-3',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        name: 'Beach Shack Vibes',
        caption: 'Fresh lime soda & fish curry'
      },
      {
        id: 'goa-4',
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
        name: 'Sunset Sky Beach',
        caption: 'Arambol drums'
      },
      {
        id: 'goa-5',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        name: 'Road trip sunglasses',
        caption: 'Windows down, music up'
      },
      {
        id: 'goa-6',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        name: 'Fairy lights & dinner',
        caption: 'Night market finds'
      }
    ]
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo 35mm Film Nights',
    vibe: 'Shinjuku neon, matcha lattes, convenience store runs & 35mm grain',
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'tk-1',
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        name: 'Tokyo Tower at Dusk',
        caption: 'Tokyo skies'
      },
      {
        id: 'tk-2',
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        name: 'Shibuya Crossing Rain',
        caption: 'Umbrella sea'
      },
      {
        id: 'tk-3',
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        name: 'Steaming Tonkotsu Ramen',
        caption: 'Best bowl in Roppongi'
      },
      {
        id: 'tk-4',
        url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
        name: 'Traditional Alley Lanterns',
        caption: 'Memory Lane / Omoide Yokocho'
      },
      {
        id: 'tk-5',
        url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
        name: 'Retro Game Arcade',
        caption: 'Gachapon obsession'
      },
      {
        id: 'tk-6',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        name: 'Vintage camera shop',
        caption: 'Picked up a fresh roll'
      }
    ]
  },
  {
    id: 'cozy-matcha',
    name: 'Cozy Coffee & Weekend Reads',
    vibe: 'Oat flat whites, paperback books, cream knitwear & rainy windows',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    photos: [
      {
        id: 'cm-1',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        name: 'Latte Art & Pastry',
        caption: 'Sunday rituals'
      },
      {
        id: 'cm-2',
        url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        name: 'Open Bookstore Shelves',
        caption: 'Left with 3 new books'
      },
      {
        id: 'cm-3',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        name: 'Furry Friend Nap',
        caption: 'Chief sleeping officer'
      },
      {
        id: 'cm-4',
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        name: 'Sunlight on Linen Bed',
        caption: 'Slow mornings'
      },
      {
        id: 'cm-5',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        name: 'Fresh Bakery Sourdough',
        caption: 'Warm bread'
      }
    ]
  }
];

export const ALL_SAMPLE_PHOTOS: PhotoItem[] = SAMPLE_PHOTO_PACKS.flatMap(pack => pack.photos);
