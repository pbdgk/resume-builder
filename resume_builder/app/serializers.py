from rest_framework import serializers

from .models import Profile, Job, School, Skill, Photo


class ProfileSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()

    def get_photo(serf, obj):
        photo = Photo.objects.get(user=obj.user)
        return photo.image.url

    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'profession', 'photo')


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



# class PhotoSerializer(serializers.Serializer):
#     image = serializers.ImageField()


#     def create(self, validated_data):
#         print(validated_data)
#         return Photo(**validated_data)
    

#     def update(self, instance, validated_data):
#         instance.image = validated_data.get('image', instance.image)
#         return instance





class PhotoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Photo
        fields = ('image',)
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
