import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MapPin, Users, Briefcase, Calendar, BookOpen, FileText, DollarSign } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import Victim from "@/models/Victim"

// This function will be called at request time
async function getVictimData(id: string) {
  await dbConnect()

  // Find victim by victimId
  const victim = await Victim.findOne({ victimId: id }).lean()

  if (!victim) {
    return null
  }

  // Convert MongoDB _id to string
  victim._id = victim._id.toString()

  return victim
}

export default async function VictimProfile({ params }: { params: { id: string } }) {
  const victim = await getVictimData(params.id)

  if (!victim) {
    notFound()
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Image and Story */}
            <div className="md:col-span-1 space-y-6">
              <div className="relative h-80 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={victim.image || "/placeholder.svg"}
                  alt={`${victim.firstName} ${victim.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>

              <Link href="/donate" className="w-full block">
                <Button className="w-full flex items-center justify-center">
                  Support the Family <Heart className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Victim's Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" /> Victim's Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{victim.story}</p>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" /> Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {victim.articles &&
                      victim.articles.map((article, index) => (
                        <li key={index}>
                          <Link href={article.url} className="block hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <p className="font-medium text-primary hover:underline">{article.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {article.source} • {article.date}
                            </p>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Financial Support Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" /> Financial Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/victims/${victim.victimId}/financial-support`}>
                    <Button variant="outline" className="w-full">
                      View Financial Support Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Victim ID</p>
                      <p className="font-mono">{victim.victimId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {victim.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">National ID/Birth Certificate</p>
                      <p className="font-medium">{victim.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(victim.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium capitalize">{victim.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Family Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium">{victim.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mother's Name</p>
                      <p className="font-medium">{victim.motherName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Family Members</p>
                    <p className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {victim.familyMembers} members
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {victim.district}, {victim.subDistrict}
                    </p>
                    <p className="text-sm mt-1">{victim.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Economic & Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Economic & Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Economic Condition</p>
                    <p className="font-medium">{victim.economicCondition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profession</p>
                    <p className="font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {victim.profession}
                    </p>
                  </div>
                  {victim.profession === "Student" && (
                    <div>
                      <p className="text-sm text-gray-500">Institution Name</p>
                      <p className="font-medium">{victim.institutionName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Incident Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Incident Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Incident Location</p>
                    <p className="font-medium">{victim.incidentPlace}</p>
                  </div>
                  {victim.status === "deceased" && (
                    <div>
                      <p className="text-sm text-gray-500">Cause of Death</p>
                      <p className="font-medium">{victim.causeOfDeath}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{victim.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
