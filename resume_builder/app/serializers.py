from rest_framework import serializers

from .models import Profile, Job, School, Skill


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'profession')


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('position', 'company', 'start', 'end', 'experience', 'priority')


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('name', 'start', 'end', 'description', 'priority')


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('name', 'rating', 'priority')


# class PersonalDataSerializer(serializers.ModelSerializer):
#     class Meta:
#         model PersonalData
#         fields = ('')
# class PhotoSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Photo
#         fields = ('image', 'owner')
#
#         # TODO: check this down
#         owner = serializers.Field(source='owner.username')

# class ResumeSerializer(serializers.Serializer):

    # main = MainSerializer()
    # photo = PhotoSerializer()
    # personal = PersonalSerializer(many=True)
    # social = SocialSerializer(many=True)
    # jobs = JobSerializer(many=True)
    # skills = SkillSerializer(many=True)
    # languages = LangunageSerializer(many=True)
