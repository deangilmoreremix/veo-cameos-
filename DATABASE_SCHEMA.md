# Database Schema Reference

Quick reference for the Smart Cameos database structure.

## Tables Overview

### user_profiles
User account information and credit balance.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| username | text | Unique username |
| avatar_url | text | Profile picture URL |
| credits | integer | Available credits (min 0) |
| total_spent | numeric | Total credits consumed |
| created_at | timestamptz | Account creation time |
| updated_at | timestamptz | Last profile update |

**Policies:**
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

---

### generations
Video generation history and metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| prompt | text | Generation prompt |
| model | text | Model used (veo-2, veo-fast) |
| aspect_ratio | text | Video aspect ratio |
| resolution | text | Video resolution |
| mode | text | Generation mode |
| status | text | generating/success/error |
| video_url | text | Generated video URL |
| error_message | text | Error details if failed |
| reference_image_url | text | Reference image if provided |
| credits_used | integer | Credits consumed |
| created_at | timestamptz | Generation start time |
| completed_at | timestamptz | Generation end time |

**Policies:**
- Users can view their own generations
- Users can insert their own generations
- Users can update their own generations
- Users can delete their own generations

---

### credit_transactions
Complete audit log of credit changes.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| amount | integer | Credit change (positive or negative) |
| transaction_type | text | purchase/generation/refund/bonus |
| description | text | Transaction description |
| generation_id | uuid | References generations if applicable |
| metadata | jsonb | Additional transaction data |
| created_at | timestamptz | Transaction time |

**Policies:**
- Users can view their own transactions
- Users can insert their own transactions

---

### pricing_tiers
Available credit packages for purchase.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Tier name (Starter, Creator, etc.) |
| credits | integer | Number of credits |
| price | numeric | Price in dollars |
| is_active | boolean | Whether tier is available |
| sort_order | integer | Display order |
| created_at | timestamptz | Tier creation time |

**Policies:**
- Authenticated users can view active tiers

**Default Data:**
- Starter: 100 credits, $9.99
- Creator: 500 credits, $39.99
- Pro: 1500 credits, $99.99
- Enterprise: 5000 credits, $299.99

---

### brand_guidelines
User's brand identity and style preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| brand_name | text | Brand name |
| values | text[] | Brand values |
| tone_of_voice | text[] | Communication style |
| visual_style | text | Visual aesthetics |
| do_list | text[] | Brand do's |
| dont_list | text[] | Brand don'ts |
| color_palette | text[] | Brand colors |
| fonts | text | Typography preferences |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Policies:**
- Users can view their own brand guidelines
- Users can insert their own brand guidelines
- Users can update their own brand guidelines
- Users can delete their own brand guidelines

---

### tool_configurations
User preferences for individual AI tools.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| tool_name | text | Name of the AI tool |
| character_id | text | Associated character if any |
| configuration | jsonb | Tool-specific settings |
| is_favorite | boolean | Whether marked as favorite |
| usage_count | integer | Number of times used |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Policies:**
- Users can view their own tool configurations
- Users can insert their own tool configurations
- Users can update their own tool configurations
- Users can delete their own tool configurations

---

### campaigns
Multi-video campaign planning and tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| name | text | Campaign name |
| description | text | Campaign description |
| target_audience | text | Audience description |
| platform | text[] | Target platforms |
| status | text | draft/active/completed |
| total_videos | integer | Planned video count |
| completed_videos | integer | Videos completed |
| concepts | jsonb | Campaign video concepts |
| brand_guidelines_id | uuid | References brand_guidelines |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |
| completed_at | timestamptz | Completion time |

**Policies:**
- Users can view their own campaigns
- Users can insert their own campaigns
- Users can update their own campaigns
- Users can delete their own campaigns

---

### storyboard_sequences
Frame-by-frame video planning.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| campaign_id | uuid | References campaigns |
| name | text | Sequence name |
| frames | jsonb | Frame descriptions and timing |
| total_duration | integer | Total duration in seconds |
| character_id | text | Associated character if any |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Policies:**
- Users can view their own storyboard sequences
- Users can insert their own storyboard sequences
- Users can update their own storyboard sequences
- Users can delete their own storyboard sequences

---

### style_presets
Saved visual styles for reuse.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| name | text | Preset name |
| character_id | text | Associated character if any |
| style_data | jsonb | Style parameters |
| thumbnail_url | text | Preview image |
| is_favorite | boolean | Whether marked as favorite |
| usage_count | integer | Number of times used |
| tags | text[] | Searchable tags |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Policies:**
- Users can view their own style presets
- Users can insert their own style presets
- Users can update their own style presets
- Users can delete their own style presets

---

### performance_metrics
Video performance tracking and predictions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| generation_id | uuid | References generations |
| prompt | text | Generation prompt |
| character_id | text | Associated character if any |
| platform | text | Target platform |
| predicted_score | numeric | Predicted performance |
| actual_engagement | jsonb | Actual performance data |
| quality_score | numeric | Video quality score |
| style_consistency | numeric | Style consistency score |
| brand_compliance | numeric | Brand compliance score |
| improvements | jsonb | Suggested improvements |
| created_at | timestamptz | Metric creation time |

**Policies:**
- Users can view their own performance metrics
- Users can insert their own performance metrics
- Users can update their own performance metrics

---

### tool_preset_chains
Saved sequences of tool workflows.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| name | text | Chain name |
| description | text | Chain description |
| tools | jsonb | Sequence of tools and settings |
| is_favorite | boolean | Whether marked as favorite |
| usage_count | integer | Number of times used |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Policies:**
- Users can view their own tool preset chains
- Users can insert their own tool preset chains
- Users can update their own tool preset chains
- Users can delete their own tool preset chains

---

### platform_configurations
Platform-specific preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References user_profiles |
| platform | text | Platform name |
| aspect_ratio | text | Preferred aspect ratio |
| preferred_style | jsonb | Style preferences |
| prompt_templates | jsonb | Prompt templates |
| character_preferences | jsonb | Character preferences |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

**Unique Constraint:** (user_id, platform)

**Policies:**
- Users can view their own platform configurations
- Users can insert their own platform configurations
- Users can update their own platform configurations
- Users can delete their own platform configurations

---

## Functions

### handle_new_user()
Automatically creates a user profile when a new user signs up.
- Triggered after INSERT on auth.users
- Creates user_profiles entry with 100 starting credits
- Uses username from metadata or derives from email

### update_updated_at_column()
Automatically updates the updated_at timestamp on row updates.
- Applied to multiple tables via triggers
- Ensures updated_at is always current

---

## Indexes

Performance-optimized indexes on:
- user_profiles: username, created_at
- generations: user_id, created_at, status
- credit_transactions: user_id, created_at
- All other tables: user_id for ownership lookups
- Additional indexes on frequently queried columns

---

## Security Model

All tables use Row Level Security (RLS) with the following pattern:

1. **Enable RLS**: All tables have RLS enabled
2. **SELECT Policy**: Users can view their own data (auth.uid() = user_id)
3. **INSERT Policy**: Users can insert their own data (auth.uid() = user_id)
4. **UPDATE Policy**: Users can update their own data with ownership check
5. **DELETE Policy**: Users can delete their own data (where applicable)

Exception: pricing_tiers is readable by all authenticated users for active tiers.

---

## Data Types Reference

- **uuid**: Universally unique identifier
- **text**: Variable-length string
- **integer**: Whole numbers
- **numeric**: Decimal numbers
- **boolean**: true/false
- **timestamptz**: Timestamp with timezone
- **jsonb**: JSON binary format (efficient querying)
- **text[]**: Array of text values
