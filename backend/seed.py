from app import create_app, db
from app.models import User, StudyGroup, Membership, StudySession, Message

app = create_app()

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create sample users
        user1 = User(username='alice', email='alice@example.com')
        user1.set_password('password1')
        user2 = User(username='bob', email='bob@example.com')
        user2.set_password('password2')

        db.session.add_all([user1, user2])
        db.session.commit()

        # Create sample study groups
        group1 = StudyGroup(title='Math Study Group', subject='Mathematics', description='Group for math enthusiasts', created_by=user1.id)
        group2 = StudyGroup(title='History Buffs', subject='History', description='Discuss historical events', created_by=user2.id)

        db.session.add_all([group1, group2])
        db.session.commit()

        # Add memberships
        membership1 = Membership(user_id=user1.id, group_id=group1.id)
        membership2 = Membership(user_id=user2.id, group_id=group1.id)
        membership3 = Membership(user_id=user2.id, group_id=group2.id)

        db.session.add_all([membership1, membership2, membership3])
        db.session.commit()

        # Create study sessions
        from datetime import date, time
        session1 = StudySession(group_id=group1.id, date=date(2024, 7, 1), time=time(15, 0), location='Library Room 101')
        session2 = StudySession(group_id=group2.id, date=date(2024, 7, 2), time=time(17, 30), location='Online Zoom')

        db.session.add_all([session1, session2])
        db.session.commit()

        print("Seed data created successfully.")

if __name__ == '__main__':
    seed_data()
