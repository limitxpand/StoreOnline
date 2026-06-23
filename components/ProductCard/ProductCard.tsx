import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  title: string;
  category: string;
  type: string; // MT5, MT4, etc
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFree?: boolean;
  slug?: string;
}

export default function ProductCard({
  title,
  category,
  type,
  price,
  rating,
  reviews,
  image,
  isFree = false,
  slug
}: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* Using a placeholder div instead of Image for MVP scaffolding */}
        <div className={styles.imagePlaceholder} style={{ backgroundImage: `url(${image})` }}>
          <span className={styles.badge}>{type}</span>
          <button className={styles.wishlistBtn}>♡</button>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        
        <div className={styles.stats}>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span className={styles.score}>{rating}</span>
            <span className={styles.reviews}>({reviews})</span>
          </div>
          <div className={styles.price}>
            {isFree ? 'Free' : `$${price.toFixed(2)}`}
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.buyBtn}>
            <span className={styles.cartIcon}>🛒</span>
          </button>
          <Link href={`/product/${slug || title.toLowerCase().replace(/ /g, '-')}`} className={styles.detailsBtn}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
