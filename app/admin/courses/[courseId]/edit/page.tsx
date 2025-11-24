import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseBasicInfoForm from "@/components/react-hook-form/CourseBasicInfoForm";
import CourseStructure from "./_components/CourseStructure";

type Params = {
  params: Promise<{ courseId: string }>;
};

const EditCourse = async ({ params }: Params) => {
  const { courseId } = await params;

  // const chapter = await prisma.chapter.create({
  //   data: {
  //     title: "Chapter No.2",
  //     position: 1,
  //     courseId: courseId,
  //   },
  // });

  // const data = [
  //   { position: 1, title: "Lesson No.1", chapterId: chapter.id },
  //   { position: 2, title: "Lesson No.2", chapterId: chapter.id },
  //   { position: 3, title: "Lesson No.3", chapterId: chapter.id },
  // ];

  // const lesson = await prisma.lesson.createMany({
  //   data: data,
  // });

  const course = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course: <span className="text-primary underline">{course.title}</span>
      </h1>

      <Tabs defaultValue="basic-info">
        <TabsList className="w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Provide basic information about the course.</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseBasicInfoForm usage="edit" data={course} courseId={courseId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can update course structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;
