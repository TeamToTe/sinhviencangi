CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contributions (
    id BIGSERIAL PRIMARY KEY,
    contributor_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id),
    contribution_id BIGINT REFERENCES contributions(id)
        ON DELETE SET NULL,

    name VARCHAR(255) NOT NULL,
    area VARCHAR(100),
    address TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    min_price INTEGER,
    max_price INTEGER,

    rent_price INTEGER,
    electricity_price INTEGER,
    water_price TEXT,

    room_status VARCHAR(50),
    opening_hours TEXT,
    phone VARCHAR(50),

    amenities TEXT[],
    images TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    place_id BIGINT NOT NULL
        REFERENCES places(id)
        ON DELETE CASCADE,

    contribution_id BIGINT
        REFERENCES contributions(id)
        ON DELETE SET NULL,

    rating INTEGER NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_category
ON places(category_id);

CREATE INDEX idx_places_contribution
ON places(contribution_id);

CREATE INDEX idx_places_latitude
ON places(latitude);

CREATE INDEX idx_places_longitude
ON places(longitude);

CREATE INDEX idx_reviews_place
ON reviews(place_id);