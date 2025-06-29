from alembic import op
import sqlalchemy as sa

revision = 'ee178ac084f6'
down_revision = '2e833718e62c'
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('item', 'owner_id',
        existing_type=sa.Integer(),
        type_=sa.String(length=64),
        existing_nullable=False
    )
    op.alter_column('marketplace_item', 'owner_id',
        existing_type=sa.Integer(),
        type_=sa.String(length=64),
        existing_nullable=False
    )

def downgrade():
    op.alter_column('item', 'owner_id',
        existing_type=sa.String(length=64),
        type_=sa.Integer(),
        existing_nullable=False
    )
    op.alter_column('marketplace_item', 'owner_id',
        existing_type=sa.String(length=64),
        type_=sa.Integer(),
        existing_nullable=False
    )
