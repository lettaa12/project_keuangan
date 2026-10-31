-- Skema database Atur Keuangan (MySQL 8)

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_category_name_type (name, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transactions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  type ENUM('income', 'expense') NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tx_date (transaction_date),
  KEY idx_tx_type (type),
  CONSTRAINT fk_tx_category FOREIGN KEY (category_id)
    REFERENCES categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Kategori awal (boleh dihapus / diubah lewat aplikasi)
INSERT IGNORE INTO categories (name, type) VALUES
  ('Gaji', 'income'),
  ('Bonus', 'income'),
  ('Usaha', 'income'),
  ('Makan & Minum', 'expense'),
  ('Transportasi', 'expense'),
  ('Tagihan', 'expense'),
  ('Belanja', 'expense'),
  ('Hiburan', 'expense');