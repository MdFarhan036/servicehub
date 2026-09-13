import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "./CategoryServicesPage.css";

export default function CategoryServicesPage() {
    const { id } = useParams();

    const [category, setCategory] =
        useState(null);

    const [services, setServices] =
        useState([]);

    const [
        filteredServices,
        setFilteredServices
    ] = useState([]);

    const [aboutData, setAboutData] =
        useState(null);

    const [
        highlightData,
        setHighlightData
    ] = useState([]);

    const [
        testimonialData,
        setTestimonialData
    ] = useState([]);

    const [faqData, setFaqData] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [
        sortOption,
        setSortOption
    ] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                categoryRes,
                serviceRes,
                aboutRes,
                highlightRes,
                testimonialRes,
                faqRes
            ] = await Promise.all([
                API.get("/categories"),
                API.get("/services"),
                API.get("/admin/about"),
                API.get("/admin/highlights"),
                API.get("/admin/testimonials"),
                API.get("/faqs")
            ]);

            const categories =
                categoryRes.data || [];

            const currentCategory =
                categories.find(
                    (cat) =>
                        String(cat.id) ===
                        String(id)
                );

            setCategory(currentCategory);

            const categoryServices =
                (
                    serviceRes.data || []
                ).filter(
                    (service) =>
                        String(
                            service.category_id
                        ) === String(id)
                );

            setServices(
                categoryServices
            );

            setFilteredServices(
                categoryServices
            );

            setAboutData(
                aboutRes.data
            );

            setHighlightData(
                highlightRes.data || []
            );

            setTestimonialData(
                testimonialRes.data || []
            );

            setFaqData(
                faqRes.data || []
            );

        } catch (err) {
            console.error(
                "Category services error:",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let updated = [
            ...services
        ];

        if (search) {
            updated =
                updated.filter(
                    (service) =>
                        service.title
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );
        }

        if (sortOption === "low") {
            updated.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );
        }

        if (sortOption === "high") {
            updated.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );
        }

        setFilteredServices(
            updated
        );
    }, [
        search,
        sortOption,
        services
    ]);

    if (loading) {
        return (
            <p>
                Loading services...
            </p>
        );
    }

    return (
        <section className="category-services-page">

            {/* Breadcrumb */}
            <div className="breadcrumb-wrapper">
                <Link to="/">
                    Home
                </Link>

                <span> / </span>

                <span>
                    {category?.name}
                </span>
            </div>

            {/* Header */}
            <div className="category-header">
                <h1>
                    {category?.name} Services
                </h1>

                <p>
                    Explore trusted
                    professionals
                </p>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <select
                    value={sortOption}
                    onChange={(e) =>
                        setSortOption(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Sort By
                    </option>

                    <option value="low">
                        Price Low to High
                    </option>

                    <option value="high">
                        Price High to Low
                    </option>
                </select>
            </div>

            {/* Services Grid */}
            <div className="services-grid">
                {filteredServices.length > 0 ? (
                    filteredServices.map(
                        (service) => {

                            const image =
                                service.images?.[0] ||
                                service.image ||
                                null;

                            return (
                                <div
                                    className="service-card"
                                    key={service.id}
                                >

                                    <div className="service-content">
                                        <h3>
                                            {service.title}
                                        </h3>

                                        <div className="service-rating">
                                            ⭐ 4.7
                                            <span>
                                                (500+
                                                reviews)
                                            </span>
                                        </div>

                                        <div className="service-price">
                                            Starts at ₹
                                            {service.price}
                                        </div>

                                        <div className="service-feature">
                                            • Professional
                                            service with
                                            verified
                                            experts
                                        </div>

                                        <Link
                                            to={`/services/${service.id}`}
                                            className="details-link"
                                        >
                                            View details
                                        </Link>
                                    </div>

                                    <div className="service-image-box">

                                        <img
                                            src={getImageUrl(image)}
                                            alt={service.title}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/placeholder.jpg";
                                            }}
                                        />

                                        <Link
                                            to={`/services/${service.id}`}
                                        >
                                            <button className="add-btn">
                                                Add
                                            </button>
                                        </Link>

                                    </div>

                                </div>
                            );
                        }
                    )
                ) : (
                    <p>
                        No services found
                    </p>
                )}
            </div>

            {/* Why Choose Us */}
            {highlightData.length > 0 && (
                <section className="why-choose-section">
                    <h2>
                        Why Choose Us
                    </h2>

                    <div className="highlight-grid">
                        {highlightData.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="highlight-card"
                                >
                                    <h3>
                                        {item.value}
                                    </h3>

                                    <p>
                                        {item.label}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}

            {/* About Section */}
            {aboutData && (
                <section className="about-section">
                    <h2>
                        About {category?.name}
                    </h2>

                    <p>
                        {aboutData.intro_para1 ||
                            aboutData.description}
                    </p>
                </section>
            )}

            {/* Testimonials */}
            {testimonialData.length > 0 && (
                <section className="testimonial-section">
                    <h2>
                        Customer Reviews
                    </h2>

                    <div className="testimonial-grid">
                        {testimonialData
                            .slice(0, 3)
                            .map(
                                (item) => (
                                    <div
                                        key={item.id}
                                        className="testimonial-card"
                                    >
                                        <p>
                                            "
                                            {item.message}
                                            "
                                        </p>

                                        <h4>
                                            {item.name}
                                        </h4>

                                        <span>
                                            {item.designation}
                                        </span>
                                    </div>
                                )
                            )}
                    </div>
                </section>
            )}

            {/* FAQ */}
            {faqData.length > 0 && (
                <section className="faq-section">
                    <h2>
                        Frequently Asked Questions
                    </h2>

                    {faqData
                        .slice(0, 5)
                        .map(
                            (faq) => (
                                <div
                                    key={faq.id}
                                    className="faq-item"
                                >
                                    <h4>
                                        {faq.question}
                                    </h4>

                                    <p>
                                        {faq.answer}
                                    </p>
                                </div>
                            )
                        )}
                </section>
            )}

        </section>
    );
}