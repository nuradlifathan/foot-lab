import { useNavigate } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Trophy, ChevronRight, Zap, BarChart3, Star } from "lucide-react"
import RealKlasemen from "@/components/RealKlasemen"

const LandingPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 100])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  const handleLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      navigate('/login')
    } else {
      navigate('/register')
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
      
      {/* Floating Elements */}
      <motion.div 
        style={{ y: y1, x: -50 }} 
        className="absolute top-20 left-10 text-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <Trophy size={300} />
      </motion.div>
      <motion.div 
        style={{ y: y2, x: 50 }} 
        className="absolute bottom-40 right-10 text-blue-500/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Zap size={250} />
      </motion.div>

      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-card/10 backdrop-blur-md sticky top-0 z-50">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-2xl animate-spin-slow">⚽</span>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Foot Lab
          </span>
        </motion.div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 relative">
           <motion.div
             variants={container}
             initial="hidden"
             animate="show"
             className="max-w-4xl mx-auto space-y-8 relative z-10"
           >
             <motion.div variants={item}>
               <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                 New: AI Match Engine 🤖
               </span>
               <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                 Build Your <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient-x">
                   Dream League.
                 </span>
               </h1>
             </motion.div>
             
             <motion.p variants={item} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
               The ultimate football management sandbox. Create clubs, simulate matches with probability-based AI, and track live Premier League stats.
             </motion.p>
             
             {/* Role Selection / Dashboard Button */}
             <motion.div variants={item} className="mt-12">
               <Card className="max-w-md mx-auto border-primary/20 shadow-2xl bg-card/60 backdrop-blur-xl hover:shadow-primary/10 transition-shadow duration-500">
                 <CardHeader>
                   <CardTitle>{isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]}!` : "Start Your Career"}</CardTitle>
                   <CardDescription>{isAuthenticated ? "Continue where you left off" : "Select access level"}</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   {isAuthenticated ? (
                     <Button 
                       size="lg" 
                       className="w-full h-14 text-lg relative overflow-hidden group"
                       onClick={() => navigate('/dashboard')}
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                       <div className="flex items-center gap-3">
                         <Shield className="h-5 w-5" />
                         Go to Dashboard
                       </div>
                       <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                     </Button>
                   ) : (
                     <>
                       <Button 
                         size="lg" 
                         className="w-full justify-between group h-14 text-lg relative overflow-hidden" 
                         onClick={() => handleLogin('admin')}
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                         <div className="flex items-center gap-3">
                           <Shield className="h-5 w-5" />
                           Login as Admin
                         </div>
                         <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                       </Button>
                       <Button 
                         variant="outline" 
                         size="lg" 
                         className="w-full justify-between group h-14 text-lg hover:bg-secondary/50"
                         onClick={() => handleLogin('user')}
                       >
                         <div className="flex items-center gap-3">
                           <Users className="h-5 w-5" />
                           Continue as User
                         </div>
                         <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                       </Button>
                     </>
                   )}
                 </CardContent>
               </Card>
             </motion.div>
           </motion.div>
        </section>

        {/* Features Grid */}
        {/* Real-time Data Preview Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/50 skew-y-3 -z-10 scale-110" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-left order-2 lg:order-1">
                   <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                     Live Data. <br/>
                     <span className="text-primary">Real Impact.</span>
                   </h2>
                   <p className="text-xl text-muted-foreground leading-relaxed">
                     Don't just simulate. Connect to the real world. Foot Lab integrates with official Football Data APIs to bring you live Premier League standings, match results, and form guides directly into your dashboard.
                   </p>
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-sm">
                         <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Zap className="w-6 h-6 text-yellow-500" />
                         </div>
                         <div>
                            <h4 className="font-bold">Live Match Updates</h4>
                            <p className="text-sm text-muted-foreground">Scores update in real-time as goals fly in.</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-sm">
                         <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-500" />
                         </div>
                         <div>
                            <h4 className="font-bold">Detailed Stats</h4>
                            <p className="text-sm text-muted-foreground">Track GD, Points, and Form across 5+ leagues.</p>
                         </div>
                      </div>
                   </div>

                   <Button size="lg" className="mt-4" onClick={() => navigate('/real-klasemen')}>
                     Check Live Standings
                     <ChevronRight className="ml-2 h-4 w-4" />
                   </Button>
                </div>

                <div className="order-1 lg:order-2">
                   <div className="relative">
                      {/* Decorative elements */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                      
                      <Card className="glass border-primary/20 bg-gradient-to-br from-card/80 to-primary/5 p-6 shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
                        <RealKlasemen previewMode />
                      </Card>
                   </div>
                </div>
             </div>
          </motion.div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-card/20 backdrop-blur-lg">
        <p>© 2026 Foot Lab. Built with ❤️ by RGS.</p>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc, delay, color }: { icon: any, title: string, desc: string, delay: number, color?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay, type: "spring", duration: 0.8 }}
    whileHover={{ y: -10 }}
  >
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:bg-card hover:shadow-xl transition-all duration-300 group cursor-default">
      <CardHeader>
        <div className={`mb-4 p-4 bg-background/80 rounded-2xl w-fit border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <CardTitle className={`text-xl transition-colors ${color}`}>{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{desc}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

export default LandingPage
