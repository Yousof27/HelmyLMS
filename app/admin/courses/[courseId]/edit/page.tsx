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

  const course = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-xl @sm:text-2xl @md:text-3xl font-bold mb-8">
        Edit Course: <span className="text-primary">{course.title}</span>
      </h1>

      <Tabs defaultValue="basic-info">
        <TabsList className="w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card className="rounded-none px-0!">
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
          <Card className="rounded-none @max-xl:p-0 @max-xl:pt-6 @max-xl:border-l-0 @max-xl:border-r-0 @max-xl:border-b-0 @max-xl:shadow-none">
            <CardHeader className="@max-xl:px-0">
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>Here you can update course structure.</CardDescription>
            </CardHeader>
            <CardContent className="@max-xl:px-0">
              <CourseStructure course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;
