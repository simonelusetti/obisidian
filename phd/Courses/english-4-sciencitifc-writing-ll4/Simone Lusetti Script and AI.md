# Script

Got it! Here’s the refined script without bold or italics, maintaining clarity and a formal yet engaging tone.

---

### **Slide 1: Title Slide**  
Good morning, my name is Simone Lusetti, and in this presentation, I will discuss how we leverage Large Language Models, or LLMs, to construct Knowledge Graphs. The goal is to extract structured knowledge from unstructured text while addressing challenges related to stability, explainability, and efficiency.  

This approach is particularly relevant in modern retrieval-based architectures, including Graph Retrieval-Augmented Generation, or GraphRAG, which integrates structured knowledge into generative models to improve factual accuracy and interpretability.  

---

### **Slide 2: What is a Knowledge Graph?**  
A Knowledge Graph is a structured representation of information that enables machines to process and reason over knowledge more effectively. Instead of dealing with raw text that it can't understand, a Knowledge Graph organizes information into entities, such as people, locations, or concepts, and explicitly connects them through relationships.  

For example, rather than storing a sentence like "Marie Curie discovered radium," a Knowledge Graph structures this information as distinct nodes: "Marie Curie" and "Radium," linked by the relationship "discovered." This structured format allows for better retrieval, inference, and integration with AI models.  

This is particularly useful in retrieval-augmented generation, where Knowledge Graphs help ground AI-generated responses in structured factual knowledge, improving reliability and reducing misinformation.  

---

### **Slide 3: Goal of the Project**  
The primary objective of this project is to transform unstructured natural language into a structured Knowledge Graph. Most information available in texts, articles, and online sources lacks explicit structure, making it challenging for machines to process efficiently. By extracting relevant entities and their relationships, we enable AI systems to organize, retrieve, and utilize knowledge more effectively.  

A key challenge in this process is ensuring that the extracted knowledge remains accurate, scalable, and interpretable. While LLMs are highly effective in language understanding, relying on them entirely for knowledge extraction introduces issues related to stability and reasoning control. Instead, our approach leverages LLMs specifically for encoding word representations only. Since the rest of the pipeline is completly under our control there's little risk for unpredictable and unexplainable behaviour. 

This aligns with emerging methodologies like GraphRAG, which use structured knowledge to improve the factual grounding of AI-generated responses. Explainablity here is key. If a graph is used is used in high stake decision, such as in the healthcare or legal field, there needs to be solid understanding of how this information was extracted.

---

# AI Tools
My most used AI tool is for sure ChatGPT. With the AI boom it was the first I heard about and started using, this habit stuck and now I pay for the premium model, which I found to be quite useful although it's quality seems to be decreasing recently.

I have used a lot of different AI-Art models. I would consider StableDiffusion my favority, in no small part for being open source and locally runnable by a standard, consumer grade machine (including mine!). Despite this preference I've used Dall-E2 and the built in image generators that a lot of models like copilot and chatgpt have. I've used them exclusivly for my personal reasons, since I just started my PhD I've yet to encounter the need to create any kind of images, let alone ones that would require AI tools.

# Exc 33

Author et al (2022) approached the problem of Named Entity Recognition (NER) by analyzing contiguous spans of words. 

A limitation of their approach is that not all entities are contiguous. In the sentence 

> *the patience felt pain in the legs and at times in the shoulder* 

The entity *pain in the shoulder* isn't modeled by a span. 

Our approach is to represent entities by using a binary matrix to encode entities as connections between words.

In fact, the advantage of our solution is in the flexibility it gives to represent any kind of entity: overlapping, nested, discountinous, cross entities and so on.

It is a novel approach because the use of spans, while able to detect the vast majority of entities, leaves out some of the most relevan information in a sentence.  
 
--- 

- game
- children story
- swear words