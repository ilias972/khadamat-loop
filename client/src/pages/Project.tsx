import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { 
  Plus,
  FileText,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Search
} from "lucide-react";

export default function Project() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const projectSchema = z.object({
    title: z.string().min(5, "Titre trop court (minimum 5 caractères)"),
    description: z.string().min(20, "Description trop courte (minimum 20 caractères)"),
    category: z.string().min(1, "Catégorie requise"),
    budget: z.string().min(1, "Budget requis"),
    location: z.string().min(1, "Localisation requise"),
    deadline: z.string().min(1, "Délai requis"),
    skills: z.string().optional(),
  });

  type ProjectFormData = z.infer<typeof projectSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const projectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Project created:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("project.toast.success_title"),
        description: t("project.toast.success_description"),
      });
      reset();
      setSelectedCategory("");
    },
    onError: (error: any) => {
      toast({
        title: t("project.toast.error_title"),
        description: error.message || t("project.toast.error_description"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    projectMutation.mutate(data);
  };

  const categories = [
    t("services.plumbing"),
    t("services.electricity"), 
    t("services.cleaning"),
    t("services.gardening"),
    t("services.painting"),
    t("services.repair"),
    t("services.installation"),
    t("services.deep_cleaning"),
    t("services.moving"),
    t("project.form.other")
  ];

  const budgetRanges = [
    t("project.budget.under_500"),
    t("project.budget.500_1000"), 
    t("project.budget.1000_2000"),
    t("project.budget.2000_5000"),
    t("project.budget.over_5000"),
    t("project.budget.negotiable")
  ];

  const recentProjects = [
    {
      title: t("project.examples.ac_installation"),
      budget: "2500 " + t("common.currency"),
      location: t("cities.casablanca"),
      proposals: 8,
      status: "active"
    },
    {
      title: t("project.examples.bathroom_renovation"),
      budget: "15000 " + t("common.currency"), 
      location: t("cities.rabat"),
      proposals: 12,
      status: "completed"
    },
    {
      title: t("project.examples.gardening"),
      budget: "800 " + t("common.currency"),
      location: t("cities.marrakech"), 
      proposals: 5,
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-20 md:pt-20 md:pb-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-6 md:py-8 lg:py-16 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            {t("project.hero.badge")}
          </Badge>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
            {t("project.hero.find_the")}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}{t("project.hero.ideal_provider")}
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            {t("project.hero.description")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Project Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Plus className="w-6 h-6 mr-3 text-orange-500" />
                    {t("project.form.title")}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">{t("project.form.project_title")} *</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder={t("project.form.title_placeholder")}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Category & Budget */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">{t("project.form.category")} *</Label>
                        <Select onValueChange={(value) => {
                          setValue("category", value);
                          setSelectedCategory(value);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("project.form.category_placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-red-500 text-sm">{errors.category.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget">{t("project.form.budget")} *</Label>
                        <Select onValueChange={(value) => setValue("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("project.form.budget_placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.budget && (
                          <p className="text-red-500 text-sm">{errors.budget.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Location & Deadline */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">{t("project.form.location")} *</Label>
                        <Input
                          id="location"
                          {...register("location")}
                          placeholder={t("project.form.location_placeholder")}
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm">{errors.location.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deadline">{t("project.form.deadline")} *</Label>
                        <Input
                          id="deadline"
                          {...register("deadline")}
                          placeholder={t("project.form.deadline_placeholder")}
                        />
                        {errors.deadline && (
                          <p className="text-red-500 text-sm">{errors.deadline.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("project.form.description")} *</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        rows={6}
                        placeholder={t("project.form.description_placeholder")}
                        className="resize-none"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">{t("project.form.skills")}</Label>
                      <Input
                        id="skills"
                        {...register("skills")}
                        placeholder={t("project.form.skills_placeholder")}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={projectMutation.isPending}
                      className="w-full gradient-orange text-white py-3 font-semibold rounded-xl border-0 flex items-center justify-center space-x-2"
                    >
                      {projectMutation.isPending ? (
                        <span>{t("project.form.publishing")}</span>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>{t("project.form.publish_button")}</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it works */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {t("project.how_it_works.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{t("project.how_it_works.step1_title")}</h4>
                        <p className="text-gray-600 text-sm">{t("project.how_it_works.step1_desc")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{t("project.how_it_works.step2_title")}</h4>
                        <p className="text-gray-600 text-sm">{t("project.how_it_works.step2_desc")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{t("project.how_it_works.step3_title")}</h4>
                        <p className="text-gray-600 text-sm">{t("project.how_it_works.step3_desc")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-orange-500" />
                    {t("project.recent.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {project.status === 'completed' ? t("project.status.completed") : t("project.status.active")}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {project.budget}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {project.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {project.proposals} {t("project.proposals")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {t("project.tips.title")}
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-100">
                    <li>• {t("project.tips.tip1")}</li>
                    <li>• {t("project.tips.tip2")}</li>
                    <li>• {t("project.tips.tip3")}</li>
                    <li>• {t("project.tips.tip4")}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}