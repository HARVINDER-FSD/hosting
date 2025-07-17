import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import emailjs from "emailjs-com"; // ✅ Added

const contactFormSchema = insertContactSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function Contact() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject || "No Subject",
      message: data.message,
    };

    emailjs.send(
      "service_d7yo2oi",           // ✅ Your Service ID
      "template_zpy3mgs",          // ✅ Your Template ID
      templateParams,
      "oWeOiga2pbJwKOHKt"          // ✅ Your Public Key
    )
    .then(() => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
      setIsSubmitting(false);
    })
    .catch(() => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    });
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div 
          ref={headerRef}
          className={`section-header animate-on-scroll ${headerVisible ? 'animate' : ''}`}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Let's discuss opportunities and how we can work together to create something amazing
          </p>
        </div>
        <div className="contact-container">
          <div 
            ref={leftRef}
            className={`animate-on-scroll ${leftVisible ? 'animate' : ''}`}
          >
            <h3>Let's Connect</h3>
            <p style={{ 
              color: 'var(--portfolio-text-secondary)', 
              marginBottom: '2rem' 
            }}>
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and development.
            </p>
            <div className="contact-item">
              <div className="contact-icon">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4>Email</h4>
                <a 
                  href="mailto:hs8339952@gmail.com"
                  style={{ 
                    color: 'var(--portfolio-primary)', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--portfolio-primary-dark)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--portfolio-primary)'}
                >
                  hs8339952@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4>Phone</h4>
                <a 
                  href="tel:+917229014722"
                  style={{ 
                    color: 'var(--portfolio-primary)', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--portfolio-primary-dark)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--portfolio-primary)'}
                >
                  +91 7229014722
                </a>
              </div>
            </div>
          </div>
          <form 
            ref={rightRef}
            className={`contact-form animate-on-scroll ${rightVisible ? 'animate' : ''}`}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input 
                type="text" 
                id="name" 
                {...form.register("name")}
                className="form-input" 
                placeholder="Your full name"
              />
              {form.formState.errors.name && (
                <p style={{ color: 'var(--portfolio-error)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input 
                type="email" 
                id="email" 
                {...form.register("email")}
                className="form-input" 
                placeholder="your.email@example.com"
              />
              {form.formState.errors.email && (
                <p style={{ color: 'var(--portfolio-error)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input 
                type="text" 
                id="subject" 
                {...form.register("subject")}
                className="form-input" 
                placeholder="Project discussion, job opportunity, etc."
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message *
              </label>
              <textarea 
                id="message" 
                {...form.register("message")}
                className="form-input form-textarea" 
                placeholder="Tell me about your project or opportunity..."
              />
              {form.formState.errors.message && (
                <p style={{ color: 'var(--portfolio-error)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
