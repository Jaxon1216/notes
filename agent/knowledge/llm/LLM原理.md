---
title: LLM 原理
---

> 收纳 Token、Transformer、Embedding、微调等偏模型机制的高频基础问题。

---

## 1. 什么是 Token？大模型是怎么切分文本的？

### 回答重点

**Token** 是大模型处理文本的最小单位。大模型不是一个字一个字读文本的，先通过分词器 Tokenizer 把文本切成一个个 Token，再去理解和生成。

一个 Token 不一定等于一个字。英文里，一个常见单词通常就是 1 个 Token，长一点的单词会被拆成 2～3 个 Token。中文一个汉字通常是 1～2 个 Token，取决于模型用的分词器。

计费上，**输入 Token 和输出 Token 分开计价**，价格差距很大。通常输出 Token 单价是输入的 3～4 倍。

原因是：输出 Token 要模型一个一个"生成"，每生成一个都跑一次前向推理，计算成本远高于处理输入。输入的 Token 可以并行处理，效率高得多。

![image.png](https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/LVPPCQmI_image_mianshiya.webp)

所以实际开发中有个很实用的省钱思路：尽量把信息放在输入端，用详细的 Prompt 和上下文喂进去，让模型的输出尽量简洁精准。

---

## 2. Transformer 的整体架构是怎样的？如何实现序列到序列映射？

### 回答重点

Transformer 是一种用于处理序列到序列（Sequence-to-Sequence）映射的神经网络架构。该模型由两个主要部分组成：编码器（Encoder）和解码器（Decoder）。具体实现序列到序列映射的关键步骤如下：

1）**输入嵌入**：首先，将输入序列通过词嵌入层（Embedding Layer）转换为向量表示。 2）**编码器部分**：

- 每个编码器层由多头自注意力机制（Multi-Head Self-Attention Mechanism）和前馈神经网络（Feed Forward Neural Network）组成。
- 自注意力机制使得每个位置的向量既能关注自身，也能关注其他位置的向量，从而捕捉全局信息。
- 前馈神经网络负责对每个位置的向量进行进一步的特征提取。

3）**添加位置编码**：由于Transformer不具备RNN那样的顺序信息处理能力，需要通过位置编码（Positional Encoding）给序列的元素添加位置信息。 4）**解码器部分**：

- 解码器层也由多头自注意力机制和前馈神经网络组成，但增加了一个额外的编码器-解码器Attention层。
- 除了对解码器中前一时刻的输出进行处理外，还会从编码器中获得编码后的语义向量。 5）**输出嵌入**：最后，将解码器输出的向量通过一个全连接层（Fully Connected Layer）和Softmax层，生成目标序列的概率分布。

综上，Transformer 通过编码器-解码器架构，实现了序列到序列的映射，能够同时处理输入和输出序列中的全局信息。

---

## 3. Transformer 的 Encoder 模块到底在做什么？

### 回答重点

Transformer 的 Encoder 模块是自然语言处理领域中的一个重要组件，其核心功能是将输入的序列（通常是文本）转换成高质量的特征表示。这种表示能够保留输入序列的关键信息，为后续任务（如翻译、问答）提供基础。

Encoder 模块内部由多个相同的编码层（Encoder Layer）堆叠而成。每个编码层主要由两个子层组成： 1）多头自注意力机制（Multi-Head Self-Attention）。 2）前馈神经网络（Position-Wise Feed-Forward Network）。

此外，每个子层都伴随着残差连接（Residual Connection）和层归一化（Layer Normalization）。

### 扩展知识

1）**多头自注意力机制（Multi-Head Self-Attention）**：  
自注意力机制的核心思想是：序列中的每个单词都需要关注序列中的每个其他单词，从而捕捉输入序列的全局依赖关系。多头机制则是通过并行运算使用多组不同的注意力头，以捕捉不同的子空间特征，然后将这些特征结合起来。

2）**前馈神经网络（Position-Wise Feed-Forward Network）**：  
在每个编码层中，前馈神经网络是一个两层的全连接层（每个位置）网络。它对从自注意力层输出的每个位置（每个单词的表示）进行变换，以进一步提升模型的表达能力。

3）**残差连接（Residual Connection）**：  
为了防止梯度消失和增强模型性能，Transformers 在每个子层的入口和出口处添加了残差连接。这确保了输入信息不会在通过层时丢失。

4）**层归一化（Layer Normalization）**：  
层归一化用于对数据进行标准化处理，使模型训练更加稳定、收敛速度更快。

5）**位置编码（Positional Encoding）**：  
由于 Transformer 本质上没有时序信息（位置信息），通过在输入嵌入中加入位置编码，可以让模型捕捉输入序列中单词的位置信息。这种编码通常是一种固定的正弦和余弦函数。

6）**堆叠多个编码层**：  
为了更好地捕获复杂的模式和特征，Transformer 模型的 Encoder 模块通常包含多个编码层。每个层通过不断的自注意力和前馈操作使得表示更深层次。

---

## 4. Transformer 为什么要用多头注意力机制？

### 回答重点

Transformer 采用多头注意力机制是为了增强模型的能力，通过不同的“头”来捕捉输入序列中的不同特征。多头注意力机制允许模型在不同的子空间中对输入进行查询，产生不同的表示，这有助于提高模型的表达能力和稳定性，使其能够更好地理解复杂的序列关系和全局信息。

### 扩展知识

1）**并行计算**：在训练过程中，多个注意力头可以并行计算，所以多头机制不会显著增加计算开销，同时还能提高 Transformer 的训练效率。

2）**捕捉不同的特征**：每个头可以关注输入序列的不同部分，这对复杂任务很有帮助。例如，一个头可能关注局部特征（如词之间的短距离关系），而另一个头可能关注全局特征（如文档的主题）。

3）**增强模型的稳健性**：多头机制可以降低模型过拟合的风险，因为不同的头会聚焦于不同的特征和位置，这种多样化使模型更加稳健和泛化。

4）**丰富的表示能力**：通过多个头的结合，Transformer 能够学习到更具丰富性的表示，这对于单头注意力机制难以实现的复杂任务（如长文本理解和序列生成）非常关键。

5）**灵活的注意力机制**：每个注意力头独立工作，最终再将它们的输出进行拼接和线性变换，这种设计使模型具有更大的灵活性，能够处理不同类型的输入数据和不同任务的需求。

6）**应用实例**：在许多自然语言处理（NLP）任务（如机器翻译、文本摘要、问答系统中），多头注意力机制已经证明了它的强大效果，显著提高了模型性能和表示能力。

---

## 5. Self-Attention 中的 K（Key）和 Q（Query）分别有什么作用？

### 回答重点

在 self attention（自注意力机制）中，K（Key）和 Q（Query）主要是用来衡量输入序列中各个元素之间的相似度和相关性。具体来说，query（Q）向量用于表示查询，key（K）向量用于表示我们用来比对的键，通过计算 query 和 key 的点积，我们可以得到一组注意力权重（attention weights）。这些权重表示了查询和每个键之间的相关性，权重越高，表示查询与键越相关。最终，这些权重用于加权求和 value（V）向量，得到最终的输出。

### 扩展知识

1）**更详细的过程解释：** 自注意力机制中的基本步骤如下：

- 1. **线性变换：** 原始输入序列通过线性变换产生 Q、K 和 V 矩阵。这些线性变换一般是通过权重矩阵 Wq、Wk 和 Wv 实现的，即 Q = XWq, K = XWk, V = XWv。
- 2. **计算注意力得分：** 对于 Query 向量 Q 和 Key 向量 K，计算他们的点积（类似余弦相似度），然后缩放（除以 sqrt(d_k)），得出一个注意力得分矩阵。
- 3. **Softmax 归一化：** 将注意力得分矩阵通过 Softmax 归一化得出权重矩阵，使得权重都在 [0,1] 之间且和为 1。
- 4. **加权求和 Value 向量：** 将归一化后的权重矩阵与 Value 向量 V 进行加权求和，得到最终的输出。

2）**为什么需要 self attention：** 传统的序列模型（比如 RNN 和 LSTM）通常采用固定序列长度和顺序，导致远距离依赖难以捕捉，而自注意力机制则能够捕捉任意两个位置之间的相关性，不论它们在序列中的距离多远。

3）**Transformer 架构中的应用：** Transformer 架构依赖于自注意力机制来实现并行化的序列处理，这使得它相比于传统的 RNN 和 LSTM 模型训练速度更快、捕捉长程依赖能力更强。尤其是在自然语言处理任务中，Transformer 展现了卓越的性能。

4）**多头注意力机制：** 除了单一的 self attention，Transformer 中还使用了多头注意力机制（Multi-Head Attention）。它将查询、键和值分成多个头，每个头独立执行注意力计算，然后将结果拼接起来并再次线性变换。这种做法可以捕捉输入序列中不同子空间的特征，实现更丰富的表达能力。

5）**位置编码：** 由于 self attention 机制不考虑序列的顺序，Transformer 引入了位置编码（Positional Encoding）来为输入序列中的每个位置添加位置信息，确保模型能够利用输入序列的顺序信息。

---

## 6. K 和 Q 可以共享同一个输入向量吗？

### 回答重点

K(Key) 和 Q(Query) 在某些Transformer实现中可以通过使用同一个输入向量来实现，它们是通过对同一个输入向量进行不同的线性变换来得到的。具体来说，我们可以使用同一个输入向量 X，分别乘以不同的权重矩阵 W_k 和 W_q，计算得到 K 和 Q 的值。

简化地说明：

- K = X * W_k
- Q = X * W_q

这里的 W_k 和 W_q 是不同的权重矩阵，通过这些权重矩阵的不同，我们得到了不同的 K 和 Q，即使它们来自于同一个输入向量 X。

### 扩展知识

其实，K 和 Q 在Transformer的注意力机制中的作用是非常重要的。下面来说下多头自注意力机制是如何工作的。

### 自注意力机制

在Transformer模型中，自注意力机制是其最核心的部分。它的主要思想是通过计算输入的不同部分之间的相似度来捕捉远距离依赖关系。自注意力机制可以看作是点乘注意力的应用：

1）首先，我们会有一个输入序列，假设这个输入序列为 X=[x1,x2,...,xn]X=[x1​,x2​,...,xn​]，每个xixi​是一个向量。 2）然后，我们把这个输入序列通过不同的线性变换得到 Query，Key 和 Value，具体来说是：

- Q=XWqQ=XWq​
- K=XWkK=XWk​
- V=XWvV=XWv​ 这里的Wq,Wk,WvWq​,Wk​,Wv​是可训练的权重矩阵。

3）接下来，我们会计算 Query 和 Key 的点积来获得注意力分数：

- Attention(Q,K,V)=softmax(QKTdk)VAttention(Q,K,V)=softmax(dk​​QKT​)V 这里，QKTQKT的结果通过softmax归一化，以确保所有的注意力分数加起来等于1。随后，我们用所得的注意力分数来加权Value向量。

### 多头自注意力

为了让模型捕捉到不同的特征和模式，我们通常会使用多头自注意力机制，其主要思想是将查询、键和值分成多个子空间进行多个注意力计算，然后将结果拼接起来：

1）多头机制按照头数将输入序列分割。 2）每个头分别计算自己的注意力值，然后将这些结果拼接在一起：

- MultiHead(Q,K,V)=[head1,head2,...,headh]WoMultiHead(Q,K,V)=[head1​,head2​,...,headh​]Wo​ 其中，headi=Attention(QWqi,KWki,VWvi)headi​=Attention(QWqi​​,KWki​​,VWvi​​)。

通过这种多头机制，Transformer能够同时关注输入的不同方面，从而更好地捕捉长期依赖关系。

---

## 7. 多头注意力为什么要对每个 head 进行降维？

### 回答重点

在进行多头注意力机制时，通常需要对每个 head 进行降维。具体来说，多头注意力机制会将输入的数据通过线性变换分成多个头，每个头可以看作是一个独立的注意力模块。这种变换的目的在于降低每个头的维度，从而保持计算的总开销相对较低。最终，这些头的输出会被连接（Concatenate）起来，再经过一次线性变换以恢复到原始的维数。

### 扩展知识

1）**多头注意力机制的基本概念**： 多头注意力机制是 Transformer 模型中的核心组件。它通过引入多个独立的注意力头，可以捕捉到不同的特征和维度，从而增强模型的表达能力和稳定性。每个头独立应用自注意力计算，其访问不同的子空间，从而合力提升整体效果。

2）**降维的操作**： 在进行多头注意力计算前，一般会将输入的向量通过线性变换（通常是矩阵乘法和偏置向量加法）映射到一个低维的子空间。假设输入维度是 dmodeldmodel​，而有 (h)(h)个头，那么每个头的维度通常是 (dk=dmodel/h)(dk​=dmodel​/h)。这种设计有助于在实现并行计算的同时控制计算和存储资源的消耗。

3）**具体流程**：

- **线性变换**：对输入的 Query、Key 和 Value 进行线性变换，将其映射到多个低维空间中。
- **计算注意力**：每个头独立进行注意力计算，生成相应的注意力权重和输出。
- **合并和线性变换**：将所有头的输出进行拼接，然后通过一次线性变换将其恢复到初始维度。

4）**引入降维的必要性**：

- **并行计算**：降维后，各个头可以同时计算，提升并行计算的效率。
- **资源控制**：每个头的维度较小，累计计算量可控，避免了大矩阵运算带来的资源消耗过大。
- **能捕捉多样性特征**：不同头可以学习和捕捉输入数据的不同特征和模式。

5）**在实际应用中的权衡**： 降维的头数和每个头的维度可以是超参数，需要根据具体问题和数据集情况进行调优。头数过少可能导致模型表达能力不足，而头数过多可能带来计算负担。

---

## 8. Transformer 中的残差连接如何缓解梯度消失？

### 回答重点

Transformer 中的“残差连接”可以缓解梯度消失问题。

### 扩展知识

**残差连接的基本概念：** 残差连接（Residual Connection）最早是在 ResNet（残差网络）中引入的。它的一大特点就是能够绕过一个或者多个层，将输入直接加到输出上，使得网络的优化更加容易。通俗点理解，就是给复杂的函数拟合过程加入了一条捷径。

**残差连接如何工作：** 假设某一层的输入为 xx，输出为 F(x)F(x)，那么通过残差连接，这层的输出变为 F(x)+xF(x)+x。这种结构的好处是在梯度计算时，可以直接将梯度传递到前面的层，缓解了深层网络中常出现的梯度消失问题。

**在 Transformer 中的应用：** Transformer 模型使用了多个 attention 层和前馈神经网络层，这样的堆叠结构非常深。为了稳定训练、改善梯度流动，Transformer 在每个子层（或者说每个模块）上都使用了残差连接，并且后接一个 Layer Normalization 层。这使得模型不仅能学到复杂的特征，还能保持梯度的稳定传递。

**梯度消失问题：** 梯度消失问题在深层网络中常见，表现为网络层数增加时，反向传播的梯度逐层衰减，导致前面几层几乎没有学习效果。因此，模型难以训练或训练效果差。

**总结下残差连接的好处：** 1）缓解梯度消失：由于加了捷径，使得梯度能够直接传递到前面的层，从而降低梯度消失的风险。 2）加速收敛：通过减少梯度消失，模型更容易优化，训练速度也更快。 3）提高性能：实验证明，残差连接能大幅提升模型性能，尤其是在非常深的网络中，比如 Transformer、ResNet 等。

**扩展知识点：** 1）**Layer Normalization：** Transformer 里每个残差连接后还有一个 Layer Normalization。它通过标准化每一层的激活来稳定训练，使得收敛更快、效果更好。 2）**其他网络中的普遍应用：** 除了 ResNet 和 Transformer，残差连接已被广泛应用于各类深度学习模型中，比如生成对抗网络（GAN）、多层感知器（MLP）等。 3）**残差块（Residual Block）：** 由多个残差连接层堆叠而成，常用于构建深层卷积神经网络，尤其在图像处理领域中表现卓越。

---

## 9. 什么是注意力遮蔽（Attention Masking）？

### 回答重点

注意力遮蔽（Attention Masking）在Transformer模型中是指在计算注意力得分时，抑制一些不相关的或无效的输入。简单来说，注意力遮蔽会用来防止注意力机制在处理序列数据时关注到序列中不该被关注的位置。例如，在语言模型中，我们通常使用这种技术来防止模型在生成下一个词时参考到未来的词语。

在自注意力机制中，计算每个词的注意力权重时，我们会对词与词之间的相关性进行打分。注意力遮蔽会产生一个遮蔽矩阵，这个矩阵会把不相关的词的打分值置为负无穷（通常是 `-inf`），这样在经过Softmax处理后，它们的注意力权重也会变得极其接近零，从而实现屏蔽无效词语的目的。

### 扩展知识

1）**类型与应用：** 注意力遮蔽主要有几种类型：

- **填充遮蔽（Padding Masking）：** 用于遮蔽序列中的填充值，以避免这些值对注意力计算产生影响。在处理变长序列时，通常需要对序列进行填充，使其达到一致的长度。这个时候，你可以使用填充遮蔽来确保填充值不会干扰模型的训练。
- **未来遮蔽（Future Masking）：** 在训练生成任务时，比如语言模型中的自回归生成，用于遮蔽未来的信息，以确保模型不会“偷看”未来的词。

2）**实现方法：** 在代码实现中，通常会看到以下几个通用步骤：

- **创建遮蔽矩阵：** 根据需要创建1或0填充的矩阵。例如，在未来遮蔽中，要生成一个上三角矩阵，为1的位置表示需要遮蔽。
- **应用遮蔽矩阵：** 将遮蔽矩阵应用在注意力得分上。例如在Scaled Dot-Product Attention中，计算完成 `QK^T` 后，将遮蔽矩阵加在得分矩阵上，再进行Softmax运算。

```python
import torch
import torch.nn.functional as F
# 生成查询、键和值
Q = torch.randn(3, 5, 4)
# (batch_size, seq_len, d_k)
K = torch.randn(3, 5, 4)
# (batch_size, seq_len, d_k)
V = torch.randn(3, 5, 4)
# (batch_size, seq_len, d_v)
# 生成未来遮蔽矩阵
seq_len = Q.size(1)
future_mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
# 计算注意力得分
scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(Q.size(-1), dtype=torch.float32))
# 应用遮蔽
scores = scores.masked_fill(future_mask.unsqueeze(0), float('-inf'))
# 计算注意力权重
attention_weights = F.softmax(scores, dim=-1)
# 输出加权和值
output = torch.matmul(attention_weights, V)
```

3）**应用场景：** 注意力遮蔽在实际场景中应用广泛，尤其在自然语言处理任务中。例如：

- **句子生成任务**：如机器翻译和语言模型，使用未来遮蔽来确保输出序列的生成是严格按序进行的。
- **填充序列处理**：像文本分类、问答系统这类任务，使用填充遮蔽来剔除对填充值的无效关注。

4）**优化与挑战：** 在实际应用中，利用注意力遮蔽可以提高模型的精确度和效率，但同时也要注意其计算开销和内存占用的问题。特别是在长序列数据的处理上，随着序列长度增加，遮蔽矩阵的维度和计算复杂度也会显著增加，因此可以考虑使用一些优化技巧，比如稀疏矩阵处理和分层注意力机制。

---

## 10. Word Embedding 在文本分类中起到什么作用？

### 回答重点

Word Embedding 可以通过将词汇表示为稠密的向量，从而使文本分类任务更加高效和准确。具体而言，它使得相似的词汇在向量空间中具有相近的表示，从而能够捕捉文本中的语义关系。

### 扩展知识

下面来说下 Word Embedding 是如何增强文本分类任务的，以及一些常见的方法和技术。

1）**通过捕捉语义关系来提高分类性能**： - 在传统的文本分类方法中，我们通常会使用 Bag-of-Words 或 TF-IDF 等方法来表示文本。然而，这些方法只能捕捉词汇的出现频率而不能捕捉词汇之间的语义关系。Word Embedding 能够将词汇映射到一个连续的向量空间，使得语义相近的词汇在向量空间中更接近，从而提高模型对文本的理解和处理能力。

2）**常见的 Word Embedding 技术**： - Word2Vec：由 Google 提出的 Word2Vec 技术通过 Skip-Gram 和 CBOW 模型来训练词向量。 - GloVe：由 Stanford 提出的 Global Vectors for Word Representation 方法，通过全局词共现矩阵来训练词向量。 - FastText：由 Facebook AI Research 团队提出的一种基于 Word2Vec 的改进技术，它考虑了词的 n-gram 信息来生成词向量，使得它在处理未登录词（OOV）问题上表现更好。

3）**应用流程**： - **预处理**：首先，对文本数据进行预处理，包括分词、去停用词、词干化等。 - **选择和训练 Word Embedding 模型**：根据任务和数据选择合适的 Word Embedding 模型（例如 pre-trained Word2Vec 或 GloVe 模型，或者自己训练）。 - **文本表示**：将文本中的每个词转换为词向量，可以使用平均池化或其他聚合方法将整个文本转换为一个固定长度的向量表示。 - **分类模型构建**：将文本表示向量输入到分类模型，如 SVM、Random Forest，或深度学习模型如 CNN、RNN 等。 - **模型训练和评估**：使用训练数据训练分类模型，并使用验证数据进行模型评估。

4）**优势**： - **高效与高性能**：由于 Word Embedding 使用稠密向量表示词汇，计算更加高效，相比传统的稀疏表示（如 TF-IDF），可以显著提升模型在分类任务中的性能。 - **丰富的语义信息**：捕捉了语义相似性，使得模型具有更好的泛化能力。

---

## 11. ViLT 模型是如何处理视觉-语言任务的？

### 回答重点

ViLT模型，即Visual-Linguistic Transformer，是一种设计用于处理视觉和语言任务的模型。它将Transformer体系结构成功应用到了图像识别任务。具体来说，ViLT模型通过将图像转化为一维的序列输入，结合语言信息，一起输入到Transformer编码器中进行联合编码，从而实现图像识别任务。

具体步骤如下： 1）图像预处理：将图像划分为若干个固定大小的patch（切片）。 2）嵌入层：将这些图像patch映射到一个高维的嵌入空间，通常是通过线性变换。 3）位置编码：为每个嵌入的图像patch添加位置编码，以保留图像中的空间信息。 4）Transformer编码器：将处理后的图像序列和语言信息输入到一个共享的Transformer编码器中进行联合训练。 5）识别任务：Encoder输出的结果再经过一些全连接层等进一步处理，最后用于特定的图像识别任务，如分类、检测等。

通过这种方式，ViLT能够高效地同时处理图像和语言数据，使其能够在多模态任务中表现出色。

---

## 12. LSTM 与 GRU 是怎么解决长期依赖问题的？

### 回答重点

LSTM（长短时记忆网络）和 GRU（门控循环单元）是处理序列数据时非常常用的两种递归神经网络（RNN）结构。它们通过引入门机制解决了基本 RNN 中的长期依赖问题，使得模型在处理长期依赖关系时更加高效和稳定。

1. **LSTM（长短时记忆网络）**：
    
    - LSTM 通过引入遗忘门、输入门和输出门，使得网络可以选择性地记住或忘记信息。
    - 遗忘门决定了哪些信息应该被遗忘，输入门决定了哪些新的信息应该被加入到记忆中，输出门则控制输出的内容。
    - LSTM 擅长处理长时间跨度的依赖关系，适合解决例如翻译、语音识别等需要长距离依赖的任务。
2. **GRU（门控循环单元）**：
    
    - GRU 是 LSTM 的一个变体，但结构上更加简洁。它通过结合门机制，只引入了重置门和更新门。
    - 重置门控制是否要忘记之前的信息，更新门则决定如何更新当前信息。
    - 相比 LSTM，GRU 结构更简单，参数更少，因此训练速度更快，同时对于多数任务它也能取得与 LSTM 相当的性能。

### 扩展知识

1. **门机制的意义**：
    
    - 在传统的 RNN 中，信息通过循环连接在网络层中传播，由于无法有效地控制信息的流动，容易导致长期依赖问题（即梯度消失或爆炸），使得网络对长时间前的信息"遗忘"。
    - LSTM 和 GRU 利用门机制来控制信息的流动，从而缓解了这一问题，使得它们更加擅长处理长序列数据。
2. **LSTM 和 GRU 的对比**：
    
    - LSTM 和 GRU 在很多情况下表现很接近，但主要的不同在于结构的复杂性和计算效率。
    - GRU 的计算效率通常更高，因为它的结构更简单，这意味着在处理速度和内存占用方面有优势，适合资源有限的应用场景。
    - LSTM 由于有更多的门和状态，更加灵活，在一些复杂任务中可能会表现得更好。
3. **实际应用场景**：
    
    - **自然语言处理（NLP）**：LSTM 和 GRU 广泛用于语言建模、机器翻译、文本生成等任务。例如，在机器翻译中，LSTM 可以保持并处理长句子中的语境信息， GRU 也成了一些快速原型设计中的常用选择。
    - **时间序列预测**：如股票价格预测、气象数据分析。这里，模型需要记住历史数据的影响，LSTM 和 GRU 都能有效地捕捉到长期趋势。
    - **语音识别和生成**：在语音识别中，序列数据的时间跨度可能很长，LSTM 和 GRU 的长期依赖处理能力使得它们能够更好地解析语音信号。

---

## 13. LSTM 和 GRU 的结构区别有哪些？

### 回答重点

LSTM（Long Short-Term Memory）和 GRU（Gated Recurrent Unit）是两种常用的循环神经网络（RNN）变体，用于处理序列数据。它们的主要区别在于内部的结构设计，具体表现在以下几个方面：

1）**门控机制**：LSTM包含三个门：输入门、遗忘门和输出门，而GRU只有两个门：更新门和重置门。LSTM的门控结构更加复杂，这使其能够捕捉更长时间的依赖关系，但也增加了模型的复杂性和训练难度。

2）**记忆单元**：LSTM具有独立的记忆单元，可以保存长期的信息。而GRU将记忆单元与隐藏状态合二为一，简化了结构，但仍能有效处理序列数据。

3）**计算效率**：由于GRU的结构更简单，计算效率高于LSTM，特别是在数据量较大或需要快速训练的应用中更有优势。

---

## 14. 一个 LSTM 单元由哪些门和状态组成？

### 回答重点

一个 LSTM 单元（LSTM cell）基本由三个门和一个状态单元组成，分别是输入门（Input Gate）、遗忘门（Forget Gate）、输出门（Output Gate）和单元状态（Cell State）。它们的作用如下：

1）输入门（Input Gate）：决定了有多少新的信息需要被写入到单元状态中。 2）遗忘门（Forget Gate）：决定了有多少以前的信息需要被遗忘掉。 3）输出门（Output Gate）：决定了有多少信息需要从单元状态输出。 4）单元状态（Cell State）：作为信息的长时记忆部分，通过加权和累加传递信息。

### 扩展知识

LSTM，或者长短时记忆网络（Long Short-Term Memory），是一种特殊的递归神经网络（RNN），主要用于处理和预测序列数据。LSTM 的设计初衷就是为了解决传统 RNN 中的长程依赖问题。

深入了解一下各个组成部分：

1）输入门（Input Gate）：这个门的作用是控制当前输入与当前单元状态要结合的新信息。它涉及到一个 sigmoid 函数和一个 tanh 函数。sigmoid 函数会决定实际进入到单元状态中的新信息的比例，而 tanh 函数会生成新的候选值。

2）遗忘门（Forget Gate）：这个门主要用于控制需要遗忘的上一时间步长的信息。根据当前输入和上一时间步长的输出，通过一个 sigmoid 函数把结果映射到 [0, 1] 之间，从而决定了上一时间步长的单元状态信息有多少被保留下来。

3）输出门（Output Gate）：这个门决定了有多少信息从单元状态输出到下一个时间步长。它通过一个 sigmoid 函数决定了哪些单元状态会输出到下一时间步长，然后再通过一个 tanh 函数把这些信息变换到适合的范围。

4）单元状态（Cell State）：这是 LSTM 中最核心的部分，能够让信息在多个时间步长上传递。单元状态加权和不同的控制门相结合，保证了有用的信息被保留，不相关或者不再重要的信息被逐步忘记。

除了基础的三个门和单元状态之外，LSTM 还可以与反向传播机制结合，通过反向传播算法调整各个权重，使模型逐步优化。这也就是为什么 LSTM 在处理长序列数据时表现优异的原因之一。

---

## 15. 比较文本相似度有哪些常见方法？

### 回答重点

比较文本相似度的方法有很多，其中一些常用的方法包括余弦相似度、Jaccard相似度和编辑距离法。在具体实现上，可以根据不同的场景和需求选择合适的方法。最基本的余弦相似度是比较向量化后的文本角度的相似度，这是我比较推荐的一种方法。

### 扩展知识

1） **余弦相似度**：余弦相似度计算的是两个向量之间的余弦值，值越接近1表示两个向量越相似。文本首先要向量化，可以使用TF-IDF等方法将文本表示成向量。

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
documents = ["I love programming", "I enjoy coding"]
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix)
print(cosine_sim)
```

2） **Jaccard相似度**：Jaccard相似度度量的是两个集合的交集与并集的比值。对于文本，可以将文本分词后视为集合，计算Jaccard相似度。

```python
def jaccard_similarity(str1, str2):
    set1, set2 = set(str1.split()), set(str2.split())
    return len(set1 & set2) / len(set1 | set2)
similarity = jaccard_similarity("I love programming", "I enjoy coding")
print(similarity)
```

3） **编辑距离（Levenshtein Distance）**：编辑距离是通过计算两个字符串之间通过插入、删除或替换操作变换所需的最小步骤数来量度相似度。下例为使用Levenshtein距离库的简单实现。

```python
import Levenshtein
distance = Levenshtein.distance("I love programming", "I enjoy coding")
print(distance)
```

4） **词向量和深度学习**：对于更复杂的文本相似度计算，可以使用词向量（如Word2Vec、Glove）或深度学习模型（如BERT）来获得更高质量的向量表示，从而计算相似度。

```python
from transformers import BertTokenizer, BertModel
import torch
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
sentences = ["I love programming", "I enjoy coding"]
inputs = tokenizer(sentences, padding=True, truncation=True, return_tensors="pt")
with torch.no_grad():
    outputs = model(**inputs)
    sentence_embeddings = outputs.last_hidden_state.mean(dim=1)
    cosine_sim = torch.nn.functional.cosine_similarity(sentence_embeddings[0], sentence_embeddings[1], dim=0)
    print(cosine_sim)
```

---

## 16. 什么是大模型的涌现能力（Emergent Abilities）？

### 回答重点

**涌现能力**指的是模型规模达到某个临界值后突然冒出来的能力，小模型压根不具备，也没法通过外推小模型的表现来预测。就像水烧到 100 度才会沸腾，模型参数量没到那个点，这些能力就是出不来。

三种典型表现：

1）思维链推理

模型能像人一样把推理过程写出来，一步一步解题。以前让 GPT-2 做数学应用题，它直接蒙一个答案，正确率跟瞎猜差不多。但模型规模到了 10^22 FLOPs 这个量级，比如 GPT-3 175B，给它加一句"let's think step by step"，它就能先分析已知条件、再列方程、最后算答案，多步推理准确率直接从 17.9% 飙到 58%。

2）指令跟随能力

小模型必须喂大量示例才能干活，大模型直接给一句话指令就能动。你跟 GPT 说"用三句话总结这篇文章，语气要正式"，它就能精准执行。InstructGPT 的论文里提到，经过 RLHF 微调后，13B 的模型指令遵循能力甚至能超过 175B 的原始 GPT-3。

3）多任务理解与迁移

大模型能在没专门训练过的任务上直接开干。MMLU 测试覆盖 57 个学科，从高中数学到法律伦理都有，GPT-4 在这上面能拿到 86.4% 的准确率，而且很多题型它训练时压根没见过。

### 扩展知识

### 涌现的本质原因

目前学术界对涌现成因有几种主流解释：

1）规模触发的相变效应

物理学里水到 100 度才沸腾，这叫相变。大模型也有类似的临界点，Google 的研究显示，很多任务在模型达到 10^22 到 10^23 FLOPs 之间会发生性能跃迁。在这之前准确率可能就 25%，跟四选一瞎猜没区别；一过这个点，准确率可能直接跳到 70% 以上。这种非线性跃迁用传统的 scaling law 根本预测不出来。

2）隐式知识的涌现式组合

大模型在预训练阶段吃进了几万亿 token 的文本，里面包含了各种知识片段。参数量小的时候，这些知识是零散的，模型只能做简单的模式匹配。参数量够大之后，模型内部形成了某种隐式的知识图谱，能把分散的知识片段串起来做复杂推理。打个比方，小模型像是背了一堆公式但不会用，大模型则是真正理解了公式之间的关系。

3）任务分解能力的临界突破

复杂任务往往需要拆成多个子步骤，每个步骤都有出错的可能。假设每步正确率是 p，n 步任务的整体正确率就是 p^n。小模型单步正确率可能只有 80%，5 步任务就剩 32.8%；大模型单步正确率到 95%，5 步还能保持 77.4%。看起来单步只提升了 15 个百分点，但多步累积下来差距就是好几倍。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/cHXFl37f_uzMQCDu9DC_mianshiya.webp)

---

## 17. 什么是 Embedding？为什么需要它？

Embedding 就是把文本、图像、音频这些人能理解的信息，转换成一串数字向量，让计算机能够理解和计算。

这串向量就像文本的"数字指纹"，捕捉了语义信息。"猫"和"狗"的向量会很接近，因为它们都是动物；"开心"和"悲伤"的向量会远离，因为它们是反义词。语义相近的对象在向量空间中彼此邻近，语义相异的对象则相距较远。

![yuyi.drawio.png](https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/2s0ocsRG_yuyi.drawio_mianshiya.webp)

有了向量表示，就可以通过数学计算判断两段话是否相关。最常用的是**余弦相似度**，计算两个向量夹角的余弦值，值越接近 1 说明越相似。

在 RAG 流程中，分块后的文本块先生成 Embedding，存入向量数据库。用户提问时，系统把问题也转成 Embedding，然后在向量数据库里找相似度最高的那几个文本块，最后把这些块喂给大模型生成回答。

```python
from sentence_transformers import SentenceTransformer
# 加载 embedding 模型
model = SentenceTransformer('all-MiniLM-L6-v2')
# 文本转向量
texts = ["如何煮奶茶", "奶茶制作步骤", "Python 入门教程"]
embeddings = model.encode(texts)
# 计算相似度
from sklearn.metrics.pairwise import cosine_similarity
similarity = cosine_similarity([embeddings[0]], [embeddings[1]])
# 输出约 0.85，说明"如何煮奶茶"和"奶茶制作步骤"语义相近
```

---

## 18. 主流的 Embedding Model 有哪些类型？

**Embedding Model** 就是把文本转成向量的模型，RAG 里用它来做语义检索。主流的嵌入模型可以分成几大类：

1）OpenAI 系列：text-embedding-ada-002 是第二代模型，支持多语言，性价比高。text-embedding-3-small 和 text-embedding-3-large 是第三代，性能更强，MIRACL 多语言检索从 31.4% 提升到 44.4%，MTEB 从 61.0% 提升到 62.3%，价格还更便宜

2）Sentence-BERT 系列：基于 BERT 优化，开源免费。all-mpnet-base-v2 性能最好，all-MiniLM-L6-v2 速度最快，适合本地部署

3）Gemini Embedding：Google 出品，目前在 MTEB 基准测试中排名第一

4）Cohere Embed：embed-english-v3 是最新版本，商用场景用得比较多

5）BGE：智源研究院出品，专门针对中文优化，bge-large-zh 在中文 MTEB 榜单排名前列

6）M3E：开源轻量模型，中文场景表现不错，适合资源有限的本地部署

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/bsoZuC0f_4jFAPmlisH_mianshiya.webp)

实际选型的话：**中文场景选 BGE 或 M3E，英文场景选 OpenAI 或 Cohere，轻量部署选 Sentence-BERT**。

---

## 19. 什么是大模型微调（Fine-tuning）？

### 回答重点

**大模型微调**就是在预训练模型的基础上，用特定任务的数据对模型做二次训练，让它从"通才"变成某个领域的"专家"。

跟预训练的核心区别有三点：

1）目标不同。预训练是让模型学通用的语言理解能力，在几百 GB 甚至几 TB 的通用语料上训练，比如维基百科、书籍、网页。微调是让模型适应特定任务，比如情感分析、代码生成、医疗问答，用的是跟任务相关的小规模标注数据

2）数据规模差异大。预训练动辄用几万亿 token 的数据，训练成本是几百万甚至上千万美元。微调可能只需要几千到几十万条标注样本，几张 A100 跑几个小时就能搞定

3）学习方式不同。预训练主要是自监督学习，让模型预测下一个 token 或者还原被遮盖的词，不需要人工标注。微调通常是监督学习，需要输入输出配对的标注数据

![](https://pic.code-nav.cn/mianshiya/question_picture/markdown/OMaEe5oe_1744894051310-72ecfa84-4ed6-4d62-ba11-d6a1d247291a_mianshiya.webp)

### 扩展知识

### 为什么需要微调

预训练模型虽然能力强，但它学的是通用知识，面对特定场景还是差点意思。比如用 GPT 直接做法律合同审查，它可能连行业术语都理解不准；用它做客服问答，回复风格可能跟公司调性对不上。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/DJWc9GcG_e9sZv3CMQw_mianshiya.webp)

微调就是一个性价比极高的中间方案，不用从零开始训练，也不用忍受通用模型在特定场景的平庸表现。

### 主流微调策略

1）全参数微调，把模型所有参数都拿出来重新训练。效果最好，但成本也最高。一个 70B 参数的模型，光加载到 GPU 就需要 140GB 显存，还得额外留空间存梯度和优化器状态，没有几十张顶级显卡根本跑不动

2）部分参数微调，冻结大部分层，只训练最后几层或者特定模块。减少了计算量，但效果往往不如全参数微调

3）参数高效微调 PEFT，这是现在的主流做法。核心思路是往原模型里插入少量可训练参数，原模型参数全部冻结。**LoRA** 是最流行的一种，它在 attention 层的权重矩阵旁边加两个低秩矩阵，训练时只更新这两个小矩阵。一个 7B 的模型用 LoRA 微调，可训练参数可能只有几百万，显存占用直接降一个数量级

### LoRA 的原理

LoRA 基于一个假设：微调时权重的变化量是低秩的，不需要更新整个大矩阵。

原本要更新的权重矩阵 W 是 d×d 的，比如 4096×4096，有 1600 多万参数。LoRA 把变化量分解成两个小矩阵 A 和 B 的乘积，A 是 d×r，B 是 r×d，r 一般取 8 或 16。这样可训练参数从 d² 降到 2dr，压缩了几百倍。

推理时把 LoRA 矩阵合并回原权重，不增加任何推理延迟。而且可以给同一个基座模型挂不同的 LoRA 权重，实现多任务切换。

### 微调数据的质量比数量重要

搞微调最容易踩的坑就是迷信数据量。其实几千条高质量数据的效果往往比几万条噪声数据好。Alpaca 当年只用了 52000 条数据就把 LLaMA 调成了能聊天的模型。

高质量数据的标准：指令清晰、回答准确、覆盖多样场景、格式一致。与其花时间爬更多数据，不如花时间清洗和筛选已有数据。

**参考文档：**[Wiki 介绍](https://zh.wikipedia.org/wiki/%E5%BE%AE%E8%B0%83_\(%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0\))

---

## 20. 大模型微调的本质是什么？

### 回答重点

大模型微调是在预训练模型的基础上，用特定领域的数据集继续训练，让模型的权重朝着目标任务的方向调整。本质上是在通用知识的基础上"精雕细琢"，让模型在某个垂直领域表现得更专业。

微调的核心原理是**迁移学习**。预训练模型已经在海量数据上学会了语言的通用规律，微调就是在这个基础上，用少量的领域数据让模型学会特定领域的表达方式和知识。打个比方，预训练模型像是读完了整个图书馆的通才，微调就是让它去医院实习三个月，变成一个懂医学的通才。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/7WMwWsGw_GLRkV8xlpQ_mianshiya.webp)

什么时候需要微调而不是直接用基础模型？主要看这几种情况：

1）专业领域应用。比如医疗诊断、法律咨询这类场景，GPT 对骨科、心内科的专业术语和诊疗逻辑掌握得不够深，直接拿来用容易出错。这时候用 10 万条专科病历数据做微调，准确率能从 60% 提到 90% 以上。

2）数据安全要求高的场景。金融机构、政府部门的内部数据不能传到 OpenAI 的服务器上，只能把 LLaMA、Qwen 这类开源模型拉下来，在自己的机房里微调部署。

3）特定任务需要稳定输出。像客服机器人、代码补全这类场景，用 Prompt 工程虽然也能跑，但输出格式不稳定，token 消耗大。微调一版专用模型，响应速度快、成本低，还不用每次都塞一堆 few-shot 示例。

---

## 21. 大模型微调任务可以分成哪几类？

### 回答重点

大模型微调任务按输入输出形式可以分成几大类：

1）文本分类，输入一段文本，输出一个类别标签。典型场景有垃圾邮件识别、情感分析、内容审核、意图识别。电商平台用它做商品评论的情感分析，每天处理几百万条评价

2）命名实体识别，从文本里把人名、地名、机构名、时间这些实体抽出来并标注类型。搜索引擎用它理解查询意图，知识图谱用它抽取结构化信息

3）问答系统，给一个问题和一段上下文，让模型定位答案在哪里或者直接生成答案。智能客服、文档问答都是这个任务

4）文本生成，根据输入生成相关文本，包括摘要生成、对话生成、文案写作、代码生成。ChatGPT 本质上就是做指令跟随的文本生成任务

5）机器翻译，把一种语言翻成另一种语言。虽然通用大模型翻译能力已经不错，但特定领域比如法律、医学文档翻译还是需要专门微调

6）多模态任务，处理图文混合输入，比如图像描述生成、视觉问答、图文检索

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/YFwJJNbJ_bZT4X1Xd48_mianshiya.webp)

---

## 22. 大模型微调有哪几大类方法？

### 回答重点

大模型微调就是在预训练模型基础上，用特定任务的数据再训练一把，让模型适应具体的业务场景。常见的微调方法可以分成三大类：

**全量微调**是最直接的方式，把模型所有参数都拿来训练，效果通常最好，但代价也最大。比如对一个 7B 参数的模型做全量微调，光是优化器状态就得占用几十 GB 显存，普通团队根本玩不起。

**参数高效微调 PEFT** 是目前的主流选择，核心思路是冻结大部分参数，只训练一小部分新加的或特定的参数。常见的几种方式：

1）LoRA 给每层加低秩分解矩阵，只训练这些矩阵，参数量能压缩到原来的千分之一 2）Adapter 在 Transformer 层中间插入小型适配器模块，只训练这些新模块 3）Prefix Tuning 在输入前面加一段可训练的前缀向量，模型本体完全冻结 4）Prompt Tuning 只训练任务提示的嵌入向量，靠"提示"引导模型行为 5）P-Tuning 把提示设计成可微分的模板，让模型自己学出最优提示 6）BitFit 只调偏置项 bias，训练参数极少，在分类任务上效果还行

**量化微调**是资源受限场景下的救星。QLoRA 把模型权重量化到 4-bit 存储，再配合 LoRA 做微调，单张 3090 就能微调 65B 的模型。IR-QLoRA 在这基础上加了信息保留技术，进一步提升量化后的精度。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/rEdR74DI_DkLhXiI3Ri_mianshiya.webp)

---

## 23. 全量微调和参数高效微调（PEFT）该怎么选？

### 回答重点

微调策略分两大类：**全量微调**和**参数高效微调**（PEFT）。全量微调效果最好但成本高、容易过拟合；PEFT 方法只动一小部分参数，省资源、跑得快，大多数场景下效果也够用。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/fAXJqFIz_pn3EiTUhZj_mianshiya.webp)

### 全量微调

把模型所有参数都解冻，在下游任务数据上从头训一遍。好处是模型能完全适配任务，每个权重都能调到最优，性能天花板最高。坏处也很明显：一个 7B 的模型全量微调至少要 4 张 A100，训练时间以天计；小数据集上极易过拟合，还会"灾难性遗忘"把预训练学到的通用知识覆盖掉。

### Adapter 微调

在 Transformer 每一层里插一个小模块，只训练这些新加的 Adapter，原模型参数冻住不动。Adapter 通常是个 down-project → 非线性 → up-project 的瓶颈结构，参数量只有原模型的 1%-5%。多任务场景下只需存多份 Adapter 就行，基座模型共用，存储成本大幅下降。缺点是推理时多了一层计算，延迟会增加几个百分点；复杂任务上效果可能比全量微调差一点。

### LoRA

LoRA 的思路是：权重更新矩阵 ΔW 通常是低秩的，可以拆成两个小矩阵 A 和 B 的乘积。原权重冻住，只训练 A 和 B，参数量能压到几百万甚至几十万，存储开销只有几 MB。推理时把 A×B 加回原权重，延迟跟原模型一模一样。缺点是低秩假设不是万能的，某些需要细粒度调整的任务上表现不稳定，秩选太小会欠拟合。

### Prefix Tuning

在输入序列前面拼一段可训练的连续向量，模型看到的就是 [prefix] + [真实输入]。只训练这段 prefix，主体参数全部冻住，参数量比 Adapter 还少。多任务只需换不同的 prefix，一个基座支撑多个任务。问题是 prefix 长度、位置、初始化都很敏感，调参成本高；prefix 太长会吃掉有效上下文窗口，影响长文本任务。

### Prompt Tuning

跟 Prefix Tuning 思路类似，但更简单：只在 embedding 层加一组可训练的 soft token，不像 Prefix Tuning 要给每一层都加。参数量极少，少样本场景效果不错，切换任务只需换一组 prompt embedding。劣势是对 prompt 设计依赖大，容易陷入局部最优；数据量大或任务复杂时效果往往不如 LoRA 和 Adapter。

### BitFit

最极简的方案：只训练模型里的 bias 参数，其他全冻。bias 参数只占总参数的 0.1% 左右，几乎没有额外开销。在中小数据集上效果出奇地好，有时甚至能打平全量微调。但碰到大模型大数据，可训练参数太少就不够用了，复杂任务上容易欠拟合。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/oKuenrqA_fvnYjUtAdW_mianshiya.webp)

---

## 24. 什么是 PEFT？它的核心思路是什么？

### 回答重点

**PEFT** 全称 Parameter-Efficient Fine-Tuning，核心思路是冻结预训练模型的绝大部分参数，只训练一小撮新加的参数，就能让模型适应下游任务。

为什么需要它？全量微调一个 7B 模型，光优化器状态就要吃掉 50GB+ 显存，普通团队根本跑不动。就算硬件够用，每个任务存一份完整模型，几十个任务下来存储成本也扛不住。更麻烦的是小样本场景下全量微调特别容易过拟合，训练集上 loss 降到很低，一上线效果稀烂。

PEFT 的做法是在原模型基础上插入轻量级模块，比如 LoRA 只加两个小矩阵，Adapter 只加几层 MLP，Prefix Tuning 只加一段可训练向量。这些新增参数通常只占原模型的 0.1% 到 5%，训练起来显存占用降几倍甚至几十倍，checkpoint 从几十 GB 缩到几十 MB，多任务场景下换个小文件就能切换任务，部署运维轻松太多。

![image.png](https://pic.code-nav.cn/mianshiya/question_picture/1777886594896760834/pJ38lDfD_image_mianshiya.webp)

---

## 25. PEFT 是如何冻结大部分参数只训一小撮的？

### 回答重点

PEFT 的核心思路就一句话：冻结预训练模型的绝大部分参数，只训练一小撮新加的参数，就能让模型适应下游任务。

为什么这样做能行？预训练阶段模型已经学到了丰富的语言知识和世界知识，微调本质上只是在这个基础上做"任务适配"，需要调整的信息量其实很小。实验证明微调前后权重变化可以用低秩矩阵很好地近似，所以根本不需要动几十亿参数，训练几百万参数就够了。

三种最典型的方法：

1）**Adapter** 在每个 Transformer 层的 FFN 后面插入一个 bottleneck 结构，数据先降维到 64 或 128，过一层非线性，再升维回去。只训练这个小模块，其他参数全冻住。参数量能压到原模型的 0.1% 到 1%，效果却能达到全量微调的 95% 以上。

2）**LoRA** 在注意力层的 Q、K、V 投影矩阵旁边各挂一对低秩矩阵 A 和 B。原始权重 W 不动，输出变成 Wx + BAx。秩 r 通常设 8 或 16，参数量压缩到千分之一级别。最大的优势是推理时可以把 BA 合并进 W，延迟零增加。

3）**Prefix Tuning** 在注意力计算时，给 Key 和 Value 拼接一段可训练的前缀向量。这些前缀会影响每一层的注意力分布，相当于给模型一个持续的"任务指令"。特别适合生成类任务，对话、摘要、翻译都有不错效果。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/zlfJtVJ3_1LWNRUbg3q_mianshiya.webp)

---

## 26. PEFT 与全量微调的核心差异在哪里？

### 回答重点

**PEFT** 只动模型里一小撮参数，大部分权重冻住不动；全量微调则是把整个模型从头到尾全部参数都拿来训练。

全量微调：输入数据 → 预训练模型（所有参数可训练） → 输出 PEFT：输入数据 → 预训练模型（参数冻结）+ 少量可训练模块（Adapter/LoRA） → 输出

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/2eqLNR19_RKQwCTa4HL_mianshiya.webp)

打个比方，全量微调像把整栋大楼推倒重建，PEFT 就是在原有框架上加装几个新房间。一个 70B 参数的 LLaMA 模型，全量微调需要 8 张 A100 80G 显卡，光模型权重就占 140GB 显存；用 LoRA 的话，可训练参数只有原来的 0.1%，单卡 24G 就能跑起来。

用 Hugging Face 的 PEFT 库做 LoRA 微调只需要几行代码：

```python
from peft import LoraConfig, get_peft_model
# 配置 LoRA：只在 attention 层插入低秩矩阵
lora_config = LoraConfig( r=8, # 低秩矩阵的秩
lora_alpha=32, # 缩放系数
target_modules=["q_proj", "v_proj"], # 只改 Q 和 V 投影层
lora_dropout=0.05 )
# 原模型冻结，只有 LoRA 参数可训练
peft_model = get_peft_model(base_model, lora_config)
peft_model.print_trainable_parameters()
# 输出：trainable params: 4,194,304 || all params: 6,742,609,920 || trainable%: 0.062
```

---

## 27. LoRA 的低秩分解原理是什么？

### 回答重点

**LoRA（Low-Rank Adaptation）** 的核心思想是：模型在微调时的权重变化矩阵 ΔW 通常是低秩的，可以分解成两个小矩阵 A 和 B 的乘积。原始权重冻住不动，只训练 A 和 B，推理时把 A×B 加回原权重就行。

原始前向计算是 y = Wx，加了 LoRA 之后变成 y = Wx + BAx。其中 W 是 d×d 的原始权重矩阵（假设是 4096×4096），A 是 r×d 的降维矩阵，B 是 d×r 的升维矩阵，r 一般取 8、16、32 这种小数字。这样可训练参数从 d² 降到 2dr，参数量直接砍掉两个数量级。

比如一个 7B 参数的模型，全量微调要训 7B 个参数；用 LoRA 只训注意力层的 Q 和 V 投影，r=8 的话可训练参数只有几百万，存储开销从几十 GB 缩到几十 MB。

![image.png](https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/SUSIpi5K_image_mianshiya.webp)

### 如何结合 LoRA 进行微调

1）选择适配层。一般加在注意力机制的 Query 和 Value 投影矩阵上，这两层对任务适配最敏感。也可以加在 Key 投影或 FFN 层，效果因任务而异。

2）设置超参数。最关键的是秩 r，决定了低秩矩阵的表达能力；还有缩放因子 alpha，控制 LoRA 输出对原权重的影响程度；以及 dropout 防止过拟合。

3）注入 LoRA 模块。用 Hugging Face PEFT 库几行代码搞定：

```python
from peft import get_peft_model, LoraConfig
config = LoraConfig( r=8, lora_alpha=32, target_modules=["q_proj", "v_proj"], lora_dropout=0.05 )
model = get_peft_model(base_model, config)
```

4）训练。在下游任务数据上训练，只有 A 和 B 矩阵会更新梯度，原模型参数完全冻结。训练速度比全量微调快很多，显存占用也小得多。

5）推理。两种方式：一是把 A×B 的结果加到原权重上合并成一个模型，推理时没有任何额外开销；二是保持分离，动态加载不同任务的 LoRA 模块，方便多任务切换。

---

## 28. 如何选择合适的基座模型进行微调？

### 回答重点

选模型的核心逻辑就一句话：**任务匹配优先，资源约束其次，生态完善兜底**。

先看任务类型。文本生成、对话这类任务选 Decoder-only 架构，LLaMA、Qwen、Mistral 都行；文本分类、NER 这种理解型任务，BERT 系列更合适；多模态场景就得上 CLIP、LLaVA 这类模型。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/E5MFF4TZ_x6GwgVoNQi_mianshiya.webp)

再看资源约束。一张 3090 24G 显存，全量微调最多跑 7B 模型，用 QLoRA 能上到 30B+。预算有限就别硬上大模型，7B 的 Mistral 在很多任务上能打过早期的 13B 模型，性价比更高。

最后看生态。Hugging Face 上下载量大、issue 活跃的模型踩坑少。选个冷门模型，遇到问题连个参考都找不到，调试成本极高。

---

## 29. 大模型微调为什么默认用 AdamW 优化器？

### 回答重点

大模型微调基本就用 **AdamW**，这是目前的事实标准。LLaMA、Qwen、Mistral 这些模型的官方微调脚本清一色都是 AdamW。

AdamW 是 Adam 的改进版，核心改动是把权重衰减从梯度更新里解耦出来。原版 Adam 的 L2 正则化效果不好，因为自适应学习率会把权重衰减的影响稀释掉，AdamW 直接在参数更新后单独做衰减，正则化效果更稳定。

AdamW 参数更新流程： 1）计算当前 batch 的梯度 g 2）更新一阶动量 m = β1 * m + (1-β1) * g 3）更新二阶动量 v = β2 * v + (1-β2) * g² 4）计算偏差修正后的 m̂ 和 v̂ 5）参数更新 θ = θ - lr * m̂ / (√v̂ + ε) 6）权重衰减 θ = θ - lr * λ * θ（这一步和梯度更新解耦）

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/44g37eg6_jT4stMX3IM_mianshiya.webp)

用 Hugging Face Transformers 微调时，默认配置就是 AdamW：

```python
from transformers import TrainingArguments
training_args = TrainingArguments( output_dir="./output", optim="adamw_torch", # 默认就是这个
learning_rate=2e-5, # 微调常用 1e-5 到 5e-5
weight_decay=0.01, # AdamW 的权重衰减系数
warmup_ratio=0.1, # 前 10% 步数做 warmup )
```

除了 AdamW，其他几个优化器也得了解：

1）**SGD**：最基础的优化器，大模型微调基本不用，收敛太慢。但在 CV 领域做 ViT 微调时有些论文发现 SGD 泛化更好。

2）AdaFactor：Google 专门为大模型设计的，显存占用比 Adam 少一半，T5 官方用的就是这个。原理是把 Adam 的二阶动量从 O(n) 压缩到 O(√n)。

3）LAMB：专门为大 batch 训练设计，能把 batch size 开到几万而不崩。BERT 预训练时用 LAMB 把训练时间从 3 天压到 76 分钟。

---

## 30. 微调中如何用正则化缓解过拟合？

### 回答重点

微调时过拟合太常见了，尤其数据量小或者任务很窄的时候，模型很容易"死记硬背"训练数据，到了新样本上就拉胯。解决思路就是给训练过程加点约束，别让模型太自由发挥，这就是**正则化**。

常见的正则化手段有这么几类：

1）L2 权重衰减：在损失函数里加上所有参数平方和的惩罚项，权重更新太大就要"付代价"，防止模型对训练噪声过度敏感

2）Dropout：训练时随机"丢掉"一部分神经元，比如设成 0.1 就是每层有 10% 的神经元不参与计算，相当于在不同子网络之间切换训练，减少对特定特征的过度依赖

3）Early Stopping：实时监控验证集表现，一旦验证损失连续几个 epoch 不下降就果断停训，避免在训练集上继续"打磨"而丧失泛化能力

4）数据增强：对原始样本做同义替换、回译、随机遮蔽、噪声注入等操作，扩充训练集、引入多样性

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/D1GFlcRI_kECgHBDz4p_mianshiya.webp)

用 Hugging Face Transformers 微调时，L2 权重衰减和 Dropout 的配置长这样：

```python
from transformers import TrainingArguments, Trainer
# 配置权重衰减
training_args = TrainingArguments( output_dir="./results", weight_decay=0.01, # L2 正则化系数
num_train_epochs=3, evaluation_strategy="epoch", load_best_model_at_end=True, # 配合 early stopping )
# Dropout 在模型配置中设置
from transformers import BertConfig, BertForSequenceClassification
config = BertConfig.from_pretrained( "bert-base-uncased", hidden_dropout_prob=0.1, # 隐藏层 Dropout
attention_probs_dropout_prob=0.1, # 注意力 Dropout )
model = BertForSequenceClassification.from_pretrained( "bert-base-uncased", config=config )
```

---

## 31. 微调中遇到灾难性遗忘怎么办？

### 回答重点

微调时有个很头疼的问题叫**灾难性遗忘**：模型在学新任务的时候，把预训练阶段学到的通用能力给"冲掉"了。就像一个人全力学滑板，结果把骑自行车的感觉给忘了。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/fDPocIck_index_30_mianshiya.webp)

防止灾难性遗忘的策略主要有四类：

1）正则化方法：在损失函数里加惩罚项，限制关键参数的变化幅度。最经典的是 EWC，用 Fisher 信息矩阵衡量每个参数对旧任务的重要性，重要参数改动就要"付代价"

2）经验重放：保留一部分旧任务的样本，微调时新旧数据混着训。简单粗暴但有效，缺点是要额外存储历史数据

3）知识蒸馏：让新模型的输出去"模仿"原模型的输出分布，把旧知识以软标签的形式传递下来，不需要存原始数据

4）参数隔离：给不同任务分配不同的参数子集，比如 LoRA 这种低秩适配器，微调时只动适配器参数，预训练权重完全冻住

实际项目中，这几种方法经常组合使用。比如 LoRA 微调 + 少量旧数据重放，既省显存又能有效保留通用能力。

### 扩展知识

### EWC 的原理和实现

Elastic Weight Consolidation 的核心思想是：不是所有参数都同等重要，有些参数对旧任务影响很大，有些影响很小。我们应该重点保护那些"关键参数"。

怎么衡量参数重要性？EWC 用的是 Fisher 信息矩阵。直观理解就是：如果某个参数稍微动一下，旧任务的 loss 变化很大，说明这个参数很重要；变化很小，说明不太重要。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/SPWT9fAI_index_31_mianshiya.webp)

EWC 的损失函数长这样：

```python
import torch
import torch.nn as nn
class EWCLoss(nn.Module):
def __init__(self, model, fisher_dict, old_params, lambda_ewc=1000):
    super().__init__() self.model = model self.fisher_dict = fisher_dict
    # Fisher 信息矩阵 self.old_params = old_params
    # 旧任务训练后的参数 self.lambda_ewc = lambda_ewc
    # 正则化强度
def forward(self, task_loss):
    ewc_loss = 0
    for name, param in self.model.named_parameters():
        if name in self.fisher_dict:
            fisher = self.fisher_dict[name]
            old_param = self.old_params[name]
            # 关键参数变化大就惩罚重 ewc_loss += (fisher * (param - old_param) ** 2).sum()
            return task_loss + self.lambda_ewc * ewc_loss
# Fisher 信息矩阵的计算
def compute_fisher(model, dataloader, criterion):
    fisher_dict = {} model.eval()
    for name, param in model.named_parameters():
        fisher_dict[name] = torch.zeros_like(param)
        for inputs, labels in dataloader:
            model.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            for name, param in model.named_parameters():
                if param.grad is not None:
                    # Fisher ≈ 梯度平方的期望 fisher_dict[name] += param.grad ** 2
                    # 取平均
                    for name in fisher_dict:
                        fisher_dict[name] /= len(dataloader)
                        return fisher_dict
```

### 经验重放的几种变体

最朴素的经验重放就是存一批旧数据，微调时按比例混进去。但这有几个问题：存储开销、隐私风险、数据可能过时。

**Dark Experience Replay** 不存原始样本，而是存模型在旧样本上的输出 logits。微调时用知识蒸馏的方式让新模型去匹配这些 logits，既省空间又规避隐私问题。

**生成式重放**更激进，直接用生成模型（比如 VAE 或 GAN）去生成"伪旧数据"，完全不需要存真实样本。但生成质量是个问题，尤其在 NLP 场景下，生成的文本可能语义偏移。

实际用下来，混合策略效果最好：存少量真实样本 + 存部分 logits + 适当的正则化。

### LoRA 为什么天然抗遗忘

LoRA 的设计思路是：预训练权重完全冻住，只训练一对低秩矩阵 A 和 B。最终输出是 W₀ + BA，其中 W₀ 是原始预训练权重。

```python
import torch.nn as nn
class LoRALayer(nn.Module):
def __init__(self, original_layer, rank=8, alpha=16):
    super().__init__() self.original = original_layer self.original.weight.requires_grad = False
    # 冻结原始权重
    in_features = original_layer.in_features
    out_features = original_layer.out_features
    # 只有 A 和 B 参与训练 self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01) self.lora_B = nn.Parameter(torch.zeros(out_features, rank)) self.scaling = alpha / rank
def forward(self, x):
    # 原始输出 + LoRA 增量
    original_output = self.original(x)
    lora_output = (x @ self.lora_A.T @ self.lora_B.T) * self.scaling
    return original_output + lora_output
```

因为 W₀ 压根没动，预训练学到的知识自然就保住了。新任务的能力全靠 BA 这个"增量"来提供。而且 rank 通常设得很小（8-64），参数量只有原模型的 0.1%-1%，训练效率也高。

### 知识蒸馏防遗忘：LwF 方法

Learning without Forgetting 的核心是：微调时不光要让模型在新任务上表现好，还要让它在旧任务输入上的输出和原模型保持一致。

```python
import torch.nn.functional as F
def lwf_loss(new_model, old_model, inputs, new_labels, temperature=2.0, alpha=0.5):
    # 新任务的交叉熵损失
    new_outputs = new_model(inputs)
    task_loss = F.cross_entropy(new_outputs, new_labels)
    # 蒸馏损失：让新模型输出接近旧模型
    with torch.no_grad():
        old_outputs = old_model(inputs)
        # 用温度软化概率分布
        soft_new = F.log_softmax(new_outputs / temperature, dim=1)
        soft_old = F.softmax(old_outputs / temperature, dim=1)
        distill_loss = F.kl_div(soft_new, soft_old, reduction='batchmean')
        # 两个损失加权求和
        total_loss = alpha * task_loss + (1 - alpha) * distill_loss * (temperature ** 2)
        return total_loss
```

temperature 参数很关键：值越大，概率分布越平滑，蒸馏信号越"柔和"；值越小，越接近硬标签。一般设 2-4 效果比较好。

### 实战中的组合策略

单一方法往往不够，实际项目中常见的组合是：

1）LoRA 微调 + 5%-10% 的旧数据重放：LoRA 本身就抗遗忘，再加点旧数据双保险

2）全参数微调 + EWC + Early Stopping：如果必须全参数微调，EWC 保护关键参数，Early Stopping 防止过度拟合新任务

3）LoRA + 知识蒸馏：适合没有旧数据访问权限的场景，用原模型当 teacher 蒸馏

选哪种组合，主要看三个因素：能不能访问旧数据、显存预算多少、对旧任务性能的保留要求有多高。

---

## 32. 多模态微调中图文对齐有哪些挑战？

### 回答重点

多模态微调最核心的挑战就是**图文对齐**：图片里的视觉元素和文字描述要能准确对应上。对齐质量差，生成的图和文就会"驴唇不对马嘴"，比如文本说"红色跑车"，图片生成出来是蓝色的。

确保对齐质量主要从这几个环节入手：

1）数据清洗：用 CLIP 等模型给图文对打分，低于阈值的直接过滤掉。LAION-400M 数据集就是用 CLIP 相似度 0.3 作为门槛，能有效去除噪声样本

2）对齐损失设计：训练时不光要让模型生成像样的图/文，还要显式地约束图文语义一致性。最常见的是对比学习损失（ITC Loss），同一对图文的嵌入向量要拉近，不同对的要推远

3）评估反馈闭环：引入自动化评估指标（CLIP Score、VQA 评估）和人工打分，发现对齐问题及时调整微调策略

4）参数高效微调：用 LoRA 或 Adapter 只动少量参数，主干权重冻住，最大限度保留预训练阶段学到的对齐能力

5）数据增强：图像做光照、裁剪、遮挡变换，文本做同义替换、回译，让模型见到更多样的图文配对，提升对齐鲁棒性

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/5ROczdhA_L0PQCgAhZK_mianshiya.webp)

---

## 33. 如何判断微调效果是否达标？

### 回答重点

判断微调效果是否达标，核心是**多维度验证**：量化指标看数字、人工评审看体验、训练曲线看趋势、线上 A/B 看业务。单靠一种方式都不靠谱，得组合起来才能下结论。

1）明确任务目标并对齐评价指标。不同任务指标不一样：分类任务看准确率、F1；文本生成看 BLEU、ROUGE、Perplexity；序列标注看 token-level 或 entity-level 的 F1。指标选错了，后面评估全白搭。

2）在验证集和测试集上跑量化评估。验证集用来调超参和做早停，测试集留到最后报最终成绩。千万别拿测试集反复调参，不然成绩虚高，上线就翻车。

3）盯紧训练曲线。训练 loss 一直降但验证 loss 开始涨，那就是过拟合了；两条线都降不下去，那是欠拟合。配合早停策略，在验证指标不再提升时及时收手。

4）人工评审和用户反馈。让标注员按统一标准给输出打分，看可读性、准确性、连贯性这些自动指标抓不到的东西。有条件的话再搞个小规模用户调研，收集真实体验反馈。

5）鲁棒性测试。拿对抗样本、同义词替换、拼写错误这些"脏数据"去试，看模型会不会被轻易带偏。还要测不同领域的数据，确保泛化能力够用。

![](https://pic.code-nav.cn/mianshiya/question_picture/1843904816956411905/t9SNepA4_5NPoVoXRzk_mianshiya.webp)

---
