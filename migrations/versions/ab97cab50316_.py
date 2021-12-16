"""empty message

Revision ID: ab97cab50316
Revises: ccd7b2e52608
Create Date: 2021-12-11 12:09:36.851809

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab97cab50316'
down_revision = 'ccd7b2e52608'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('total_points', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'total_points')
    # ### end Alembic commands ###
