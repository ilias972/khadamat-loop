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

export default function Project() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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
        title: "Projet publié !",
        description: "Votre projet a été publié avec succès. Les prestataires vont recevoir des notifications.",
      });
      reset();
      setSelectedCategory("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de publication",
        description: error.message || "Une erreur s'est produite lors de la publication.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    projectMutation.mutate(data);
  };

  const categories = [
    "Plomberie",
    "Électricité", 
    "Ménage",
    "Jardinage",
    "Peinture",
    "Réparation",
    "Installation",
    "Nettoyage",
    "Déménagement",
    "Autre"
  ];

  const budgetRanges = [
    "Moins de 500 DH",
    "500 - 1000 DH", 
    "1000 - 2000 DH",
    "2000 - 5000 DH",
    "Plus de 5000 DH",
    "À négocier"
  ];

  const recentProjects = [
    {
      title: "Installation climatisation",
      budget: "2500 DH",
      location: "Casablanca",
      proposals: 8,
      status: "active"
    },
    {
      title: "Rénovation salle de bain",
      budget: "15000 DH", 
      location: "Rabat",
      proposals: 12,
      status: "completed"
    },
    {
      title: "Jardinage et entretien",
      budget: "800 DH",
      location: "Marrakech", 
      proposals: 5,
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            Publier un Projet
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trouvez le
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}Prestataire Idéal
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Décrivez votre projet et recevez des propositions de prestataires qualifiés. 
            Comparez les offres et choisissez le meilleur professionnel pour vos besoins.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Project Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Plus className="w-6 h-6 mr-3 text-orange-500" />
                    Publier un Nouveau Projet
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du Projet *</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Ex: Installation électrique dans salon"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Category & Budget */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select onValueChange={(value) => {
                          setValue("category", value);
                          setSelectedCategory(value);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
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
                        <Label htmlFor="budget">Budget *</Label>
                        <Select onValueChange={(value) => setValue("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le budget" />
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
                        <Label htmlFor="location">Localisation *</Label>
                        <Input
                          id="location"
                          {...register("location")}
                          placeholder="Ex: Casablanca, Maarif"
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm">{errors.location.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Délai souhaité *</Label>
                        <Input
                          id="deadline"
                          {...register("deadline")}
                          placeholder="Ex: Dans la semaine, Urgent"
                        />
                        {errors.deadline && (
                          <p className="text-red-500 text-sm">{errors.deadline.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description détaillée *</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        rows={6}
                        placeholder="Décrivez votre projet en détail : travaux à effectuer, contraintes, matériel fourni ou non..."
                        className="resize-none"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">Compétences recherchées</Label>
                      <Input
                        id="skills"
                        {...register("skills")}
                        placeholder="Ex: Électricien certifié, expérience domotique"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={projectMutation.isPending}
                      className="w-full gradient-orange text-white py-3 font-semibold rounded-xl border-0 flex items-center justify-center space-x-2"
                    >
                      {projectMutation.isPending ? (
                        <span>Publication...</span>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>Publier le Projet</span>
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
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Publiez votre projet</h4>
                        <p className="text-gray-600 text-sm">Décrivez vos besoins en détail</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Recevez des propositions</h4>
                        <p className="text-gray-600 text-sm">Les prestataires vous contactent</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Choisissez le meilleur</h4>
                        <p className="text-gray-600 text-sm">Comparez et sélectionnez</p>
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
                    Projets Récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {project.status === 'completed' ? 'Terminé' : 'Actif'}
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
                            {project.proposals} propositions
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
                    Conseils pour réussir
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-100">
                    <li>• Soyez précis dans votre description</li>
                    <li>• Mentionnez votre budget réaliste</li>
                    <li>• Ajoutez des photos si nécessaire</li>
                    <li>• Répondez rapidement aux prestataires</li>
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