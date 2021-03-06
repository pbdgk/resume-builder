from rest_framework import serializers

from .models import Profile, Summary, Job, School, Skill, Photo, Socials


class ProfileSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()

    def get_photo(self, obj):
        photo = Photo.objects.get(user=obj.user)
        return photo.image.url

    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'profession', 'photo')


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ('text',)

class GetSocialSerializer(serializers.ModelSerializer):

    firstGroup = serializers.SerializerMethodField()
    secondGroup = serializers.SerializerMethodField()

    def get_firstGroup(self, obj):
        return [{"label": social.label,
        "text": social.text,
        "field_type": social.field_type,
        "priority": social.priority,
        "field_name": social.field_name,
        "fa_image_class": social.fa_image_class,
        "group": social.group,
        "pk": social.pk,
        
        } for social in obj if social.group == 1]

    def get_secondGroup(self, obj):
        return[{"label": social.label,
        "text": social.text,
        "field_type": social.field_type,
        "priority": social.priority,
        "field_name": social.field_name,
        "fa_image_class": social.fa_image_class,
        "group": social.group,
        "pk": social.pk,
        } for social in obj if social.group == 2]

    class Meta:
        model = Socials
        fields = ('firstGroup', 'secondGroup')


class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Socials
        fields = ('user', 'label', 'text', 'field_type', 'priority', 'field_name', 'fa_image_class', 'group',)


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('pk', 'position', 'company', 'start', 'end', 'experience', 'priority')


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('pk', 'name', 'start', 'end', 'description', 'priority')


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('pk', 'name', 'rating', 'priority')


class PhotoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Photo
        fields = ('image',)


class DocSerializer(serializers.Serializer):
    profile = ProfileSerializer()
    img = PhotoSerializer()
    summary = SummarySerializer()
    socials = SocialSerializer(many=True)
